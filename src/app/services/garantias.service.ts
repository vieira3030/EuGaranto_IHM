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
  public dadosAlterados = new EventEmitter<void>();

  constructor(private storage: Storage, private firestore: Firestore) { 
    this.init(); 
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.carregarDadosIniciais();
  }

  private async carregarDadosIniciais() {
    const jaTemDados = await this._storage?.get('dados_app');
    if (!jaTemDados) {
      const res = await fetch('/assets/data/garantias.json');
      const dados = await res.json();
      await this._storage?.set('dados_app', dados);
    }
  }

  async getGarantias() {
    const data = await this._storage?.get('dados_app');
    return data?.garantias || [];
  }

  /** Adiciona nova garantia no Firebase e Localmente */
  async adicionarGarantia(novaGarantia: any) {
    try {
      const garantiaParaNuvem = { ...novaGarantia };
      garantiaParaNuvem.fotoTalao = '';
      garantiaParaNuvem.fotoLocal = '';

      const garantiasRef = collection(this.firestore, 'garantias');
      // 1. Grava no Firebase e recebe o ID oficial
      const docRef = await addDoc(garantiasRef, garantiaParaNuvem);
      
      // 2. IMPORTANTE: Substitui o ID temporário pelo ID real do Firebase
      novaGarantia.id = docRef.id; 
      console.log('Firebase: Criado com sucesso. ID:', docRef.id);
    } catch (error) {
      console.error('Erro Firebase ao adicionar:', error);
    }

    // 3. Grava no telemóvel com o ID correto
    let garantias = await this.getGarantias();
    garantias.push(novaGarantia);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit();
    }
  }

  /** Atualiza uma garantia existente */
  async editarGarantia(garantiaEditada: any) {
    // 1. Atualização Local
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

    // 2. Atualização na Nuvem (Firebase)
    try {
      if (garantiaEditada.id && garantiaEditada.id.length > 15) { // IDs do Firebase são longos
        const garantiaRef = doc(this.firestore, 'garantias', garantiaEditada.id);
        const copiaNuvem = { ...garantiaEditada };
        copiaNuvem.fotoTalao = '';
        copiaNuvem.fotoLocal = '';
        
        await updateDoc(garantiaRef, copiaNuvem);
        console.log('Firebase: Atualizado com sucesso.');
      } else {
        console.warn('Aviso: Esta garantia tem um ID local antigo e não pode ser editada na nuvem.');
      }
    } catch (error) {
      console.error('Erro Firebase ao editar:', error);
    }
  }

  /** Remove uma garantia local e tenta remover na nuvem */
  async removerGarantia(id: string) {
    // Local
    let garantias = await this.getGarantias();
    garantias = garantias.filter((g: any) => g.id !== id);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit();
    }

    // Firebase
    try {
      if (id && id.length > 15) {
        const docRef = doc(this.firestore, 'garantias', id);
        await deleteDoc(docRef);
        console.log('Firebase: Eliminado com sucesso.');
      }
    } catch (e) {
      console.error('Erro ao apagar no Firebase:', e);
    }
  }

  // --- MÉTODOS DE GRUPOS ---

  async criarGrupo(novoGrupo: Grupo) {
    try {
      const gruposRef = collection(this.firestore, 'grupos');
      const docRef = await addDoc(gruposRef, novoGrupo);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      return null;
    }
  }

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