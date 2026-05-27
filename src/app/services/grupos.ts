import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';

// Importação dos módulos do Firebase necessários para as operações de base de dados
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

// Estrutura de dados que define a configuração de um grupo
export interface Grupo {
  id?: string;
  nome: string;
  adminEmail: string;
  membros: string[]; // Lista de emails dos participantes do grupo
  garantiasIds: string[]; // Identificadores das garantias partilhadas
  alertaConfig: string;
}

// Serviço responsável pela gestão e sincronização dos grupos
@Injectable({
  providedIn: 'root'
})
export class GruposService {
  
  // Instância da base de dados local do Ionic
  private _storage: Storage | null = null;
  
  // Emissor de eventos para notificar a interface sobre atualizações de dados
  dadosAlterados = new Subject<void>();

  // Inicializa os serviços de armazenamento local e remoto (Firestore)
  constructor(private storage: Storage, private firestore: Firestore) {
    this.init();
  }

  // Prepara e cria a instância da base de dados local
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /** --- MÉTODOS LOCAIS (STORAGE) --- **/

  // Obtém a lista completa de grupos armazenados no dispositivo
  async getGrupos() {
    if (!this._storage) await this.init();
    const grupos = await this._storage?.get('grupos');
    return grupos || [];
  }

  // Pesquisa e devolve um grupo específico na memória local através do seu identificador
  async getGrupo(id: string) {
    const grupos = await this.getGrupos();
    return grupos.find((g: any) => g.id === id);
  }

  /** --- MÉTODOS NA NUVEM (FIREBASE) --- **/

  // Regista um novo grupo na nuvem (Firebase) e guarda uma cópia no armazenamento local
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

  // Obtém da nuvem todos os grupos aos quais o email fornecido pertence e atualiza a memória local
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

  // Remove o email do utilizador da lista de membros na nuvem e apaga o grupo da base de dados local
  async sairDoGrupo(grupoId: string, emailUsuario: string): Promise<boolean> {
    try {
      const grupoRef = doc(this.firestore, 'grupos', grupoId);
      
      // O método arrayRemove retira apenas o elemento especificado da lista remota
      await updateDoc(grupoRef, {
        membros: arrayRemove(emailUsuario)
      });

      // Sincroniza a memória local para remover o grupo da interface do utilizador
      await this.removerGrupoLocal(grupoId);
      return true;
    } catch (error) {
      console.error('Erro ao sair do grupo:', error);
      return false;
    }
  }

  /** --- FUNÇÕES AUXILIARES --- **/

  // Insere um grupo na memória local e emite um evento de atualização
  private async adicionarGrupoLocal(grupo: any) {
    const grupos = await this.getGrupos();
    grupos.push(grupo);
    await this._storage?.set('grupos', grupos);
    this.dadosAlterados.next(); 
  }

  // Elimina um grupo da memória local e emite um evento de atualização
  private async removerGrupoLocal(id: string) {
    let grupos = await this.getGrupos();
    grupos = grupos.filter((g: any) => g.id !== id);
    await this._storage?.set('grupos', grupos);
    this.dadosAlterados.next(); 
  }
}