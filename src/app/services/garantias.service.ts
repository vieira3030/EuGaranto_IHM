import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
// Importação de ferramentas do Firestore para base de dados e consultas
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';

// Estrutura de dados para um Grupo de partilha
export interface Grupo {
  id?: string;
  nome: string;
  adminEmail: string;
  membros: string[]; // Lista de emails dos participantes
  garantiasIds: string[]; // IDs das garantias partilhadas
  alertaConfig: string; // Configuração de notificação
}

@Injectable({ providedIn: 'root' })
export class GarantiasService {
  private _storage: Storage | null = null;
  
  /** Evento para notificar componentes sobre mudanças nos dados locais. */
  public dadosAlterados = new EventEmitter<void>();

  constructor(private storage: Storage, private firestore: Firestore) { 
    this.init(); 
  }

  /** Inicializa o armazenamento local. */
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

  /** Recupera garantias do armazenamento local. */
  async getGarantias() {
    const data = await this._storage?.get('dados_app');
    return data?.garantias || [];
  }

  /** Recupera categorias de grupos locais. */
  async getGrupos(): Promise<string[]> {
    const data = await this._storage?.get('dados_app');
    return data?.grupos || ["Tecnologia", "Cozinha", "Eletrodomésticos", "Ferramentas", "Outros"];
  }

  /** Remove uma garantia local por ID. */
  async removerGarantia(id: string) {
    let garantias = await this.getGarantias();
    garantias = garantias.filter((g: any) => g.id !== id);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit();
    }
  }

  /** Guarda garantia no Firebase (sem fotos) e localmente (com fotos). */
  async adicionarGarantia(novaGarantia: any) {
    // 1. Gravar na Nuvem (Firebase)
    try {
      const garantiaParaNuvem = { ...novaGarantia };
      // Limpar campos pesados para evitar erro de limite de 1MB
      garantiaParaNuvem.fotoTalao = '';
      garantiaParaNuvem.fotoLocal = '';

      const garantiasRef = collection(this.firestore, 'garantias');
      await addDoc(garantiasRef, garantiaParaNuvem);
      console.log('Sucesso: Enviado para o Firebase');
    } catch (error) {
      console.error('Erro Firebase:', error);
    }

    // 2. Gravar Localmente
    let garantias = await this.getGarantias();
    garantias.push(novaGarantia);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit();
    }
  }

  /** --- GESTÃO DE GRUPOS NA NUVEM --- **/

  /** Cria um novo grupo no Firebase. */
  async criarGrupo(novoGrupo: Grupo) {
    try {
      const gruposRef = collection(this.firestore, 'grupos');
      const docRef = await addDoc(gruposRef, novoGrupo);
      console.log('Grupo criado com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      return null;
    }
  }

  /** Procura grupos no Firebase onde o utilizador é membro. */
  async getGruposRemotos(emailUtilizador: string) {
    try {
      const gruposRef = collection(this.firestore, 'grupos');
      // Filtra grupos onde o email consta no array de membros
      const q = query(gruposRef, where('membros', 'array-contains', emailUtilizador));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Grupo[];
    } catch (error) {
      console.error('Erro ao procurar grupos remotos:', error);
      return [];
    }
  }

  /** Obtém dados de perfil do ficheiro JSON local. */
  async getPerfil() {
    try {
      const res = await fetch('/assets/data/perfil.json');
      const dados = await res.json();
      return dados.utilizador;
    } catch (error) {
      console.error('Erro ao ler perfil:', error);
      return null;
    }
  }
}