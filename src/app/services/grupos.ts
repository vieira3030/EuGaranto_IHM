import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';
// Importação das ferramentas do Firebase necessárias (inclui as de remoção)
import { 
  Firestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayRemove 
} from '@angular/fire/firestore';

// Estrutura de dados para o Grupo
export interface Grupo {
  id?: string;
  nome: string;
  adminEmail: string;
  membros: string[]; // Emails dos participantes
  garantiasIds: string[]; // IDs das garantias partilhadas
  alertaConfig: string;
}

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private _storage: Storage | null = null;
  
  // Emite um sinal quando os dados mudam (para a lista atualizar automaticamente)
  dadosAlterados = new Subject<void>();

  // Inicializa o serviço de armazenamento local e a ligação à nuvem
  constructor(private storage: Storage, private firestore: Firestore) {
    this.init();
  }

  // Cria a base de dados local
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /** --- MÉTODOS LOCAIS (STORAGE) --- **/

  // Retorna os grupos guardados no telemóvel
  async getGrupos() {
    if (!this._storage) await this.init();
    const grupos = await this._storage?.get('grupos');
    return grupos || [];
  }

  // Encontra um grupo específico na lista local através do ID
  async getGrupo(id: string) {
    const grupos = await this.getGrupos();
    return grupos.find((g: any) => g.id === id);
  }

  /** --- MÉTODOS NA NUVEM (FIREBASE) --- **/

  // Grava um novo grupo no Firebase e cria uma cópia local
  async criarGrupoRemote(novoGrupo: Grupo) {
    try {
      const gruposRef = collection(this.firestore, 'grupos');
      const docRef = await addDoc(gruposRef, novoGrupo);
      
      await this.adicionarGrupoLocal({ ...novoGrupo, id: docRef.id });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      return null;
    }
  }

  // Vai buscar à nuvem todos os grupos onde o teu email faz parte
  async getGruposRemote(email: string) {
    try {
      const gruposRef = collection(this.firestore, 'grupos');
      const q = query(gruposRef, where('membros', 'array-contains', email));
      const querySnapshot = await getDocs(q);
      
      const grupos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Grupo[];

      await this._storage?.set('grupos', grupos);
      return grupos;
    } catch (error) {
      console.error('Erro ao procurar grupos:', error);
      return [];
    }
  }

  // Remove o teu email do grupo na nuvem e apaga-o da tua lista local
  async sairDoGrupo(grupoId: string, emailUsuario: string): Promise<boolean> {
    try {
      const grupoRef = doc(this.firestore, 'grupos', grupoId);
      
      // O 'arrayRemove' tira o teu email da lista sem apagar o resto dos dados do grupo
      await updateDoc(grupoRef, {
        membros: arrayRemove(emailUsuario)
      });

      // Atualiza a lista no telemóvel para o grupo desaparecer imediatamente
      await this.removerGrupoLocal(grupoId);
      return true;
    } catch (error) {
      console.error('Erro ao sair do grupo:', error);
      return false;
    }
  }

  /** --- FUNÇÕES AUXILIARES --- **/

  // Adiciona um grupo à memória do telemóvel e avisa a aplicação
  private async adicionarGrupoLocal(grupo: any) {
    const grupos = await this.getGrupos();
    grupos.push(grupo);
    await this._storage?.set('grupos', grupos);
    this.dadosAlterados.next(); 
  }

  // Apaga um grupo da memória do telemóvel e avisa a aplicação
  private async removerGrupoLocal(id: string) {
    let grupos = await this.getGrupos();
    grupos = grupos.filter((g: any) => g.id !== id);
    await this._storage?.set('grupos', grupos);
    this.dadosAlterados.next(); 
  }
}