import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
// Importação de ferramentas do Firestore
import { Firestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';

// Estrutura de dados para um Grupo
export interface Grupo {
  id?: string;
  nome: string;
  adminEmail: string;
  membros: string[];
  garantiasIds: string[];
  alertaConfig: string;
}

@Injectable({ providedIn: 'root' })
export class GarantiasService {
  private _storage: Storage | null = null;
  
  /** Evento para notificar a interface sobre mudanças nos dados. */
  public dadosAlterados = new EventEmitter<void>();

  constructor(private storage: Storage, private firestore: Firestore) { 
    this.init(); 
  }

  /** Inicializa a base de dados local. */
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.carregarDadosIniciais();
  }

  /** Carrega dados iniciais do JSON se o storage estiver vazio. */
  private async carregarDadosIniciais() {
    const jaTemDados = await this._storage?.get('dados_app');
    if (!jaTemDados) {
      const res = await fetch('/assets/data/garantias.json');
      const dados = await res.json();
      await this._storage?.set('dados_app', dados);
    }
  }

  /** Recupera a lista de garantias locais. */
  async getGarantias() {
    const data = await this._storage?.get('dados_app');
    return data?.garantias || [];
  }

  /** Adiciona garantia no Firebase e localmente. */
  async adicionarGarantia(novaGarantia: any) {
    try {
      const garantiaParaNuvem = { ...novaGarantia };
      garantiaParaNuvem.fotoTalao = '';
      garantiaParaNuvem.fotoLocal = '';

      const garantiasRef = collection(this.firestore, 'garantias');
      const docRef = await addDoc(garantiasRef, garantiaParaNuvem);
      
      novaGarantia.id = docRef.id; 
      console.log('Firebase: Criado com ID:', docRef.id);
    } catch (error) {
      console.error('Erro Firebase:', error);
    }

    let garantias = await this.getGarantias();
    garantias.push(novaGarantia);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit(); // Notifica mudanças
    }
  }

  /** Atualiza garantia no local e no Firebase. */
  async editarGarantia(garantiaEditada: any) {
    let garantias = await this.getGarantias();
    const index = garantias.findIndex((g: any) => g.id === garantiaEditada.id);

    if (index !== -1) {
      garantias[index] = garantiaEditada;
      const dadosAtuais = await this._storage?.get('dados_app');
      if (dadosAtuais) {
        dadosAtuais.garantias = garantias;
        await this._storage?.set('dados_app', dadosAtuais);
        this.dadosAlterados.emit();
      }
    }

    try {
      if (garantiaEditada.id && garantiaEditada.id.length > 15) {
        const garantiaRef = doc(this.firestore, 'garantias', garantiaEditada.id);
        const copiaNuvem = { ...garantiaEditada };
        copiaNuvem.fotoTalao = '';
        copiaNuvem.fotoLocal = '';
        
        await updateDoc(garantiaRef, copiaNuvem);
      }
    } catch (error) {
      console.error('Erro Firebase:', error);
    }
  }

  /** Remove garantia local e remota. */
  async removerGarantia(id: string) {
    let garantias = await this.getGarantias();
    garantias = garantias.filter((g: any) => g.id !== id);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit();
    }

    try {
      if (id && id.length > 15) {
        const docRef = doc(this.firestore, 'garantias', id);
        await deleteDoc(docRef);
      }
    } catch (e) {
      console.error('Erro Firebase:', e);
    }
  }

  /** Cria um novo grupo de partilha no Firebase. */
  async criarGrupo(novoGrupo: Grupo) {
    try {
      const gruposRef = collection(this.firestore, 'grupos');
      const docRef = await addDoc(gruposRef, novoGrupo);
      
      console.log('Firebase: Grupo criado com sucesso. ID:', docRef.id);
      
      // ADICIONA ESTA LINHA: Avisa a aplicação (e a Tab 2) que há dados novos!
      this.dadosAlterados.emit();
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar grupo no Firebase:', error);
      return null;
    }
  }

  /** Atualiza grupo no Firebase e emite evento de alteração. */
  async editarGrupo(grupoEditado: Grupo) {
    try {
      if (grupoEditado.id) {
        const grupoRef = doc(this.firestore, 'grupos', grupoEditado.id);
        const copiaNuvem = { ...grupoEditado };
        delete copiaNuvem.id; 
        
        await updateDoc(grupoRef, copiaNuvem);
        console.log('Firebase: Grupo atualizado.');
        
        // Emite o aviso para as páginas recarregarem os dados
        this.dadosAlterados.emit();
      }
    } catch (error) {
    console.error('Erro Firebase ao editar grupo:', error);
  }
}

  /** Procura grupos remotos do utilizador. */
  async getGruposRemotos(emailUtilizador: string) {
    try {
      const gruposRef = collection(this.firestore, 'grupos');
      const q = query(gruposRef, where('membros', 'array-contains', emailUtilizador));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Grupo[];
    } catch (error) {
      return [];
    }
  }

  /** Devolve o perfil do utilizador. */
  async getPerfil() {
    try {
      const res = await fetch('/assets/data/perfil.json');
      const dados = await res.json();
      return dados.utilizador;
    } catch (error) {
      return null;
    }
  }
}