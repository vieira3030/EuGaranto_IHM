import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
// 1. Importar as ferramentas da base de dados Firestore
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class GarantiasService {
  private _storage: Storage | null = null;
  
  /** Evento emitido para notificar os componentes sobre alterações na base de dados local. */
  public dadosAlterados = new EventEmitter<void>();

  // 2. Injetar o Firestore no construtor lado a lado com o Storage local
  constructor(private storage: Storage, private firestore: Firestore) { 
    this.init(); 
  }

  /** Inicializa o serviço de armazenamento assíncrono. */
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.carregarDadosIniciais();
  }

  /** Carrega os dados do ficheiro JSON local caso a base de dados esteja vazia. */
  private async carregarDadosIniciais() {
    const jaTemDados = await this._storage?.get('dados_app');
    if (!jaTemDados) {
      const res = await fetch('/assets/data/garantias.json');
      const dados = await res.json();
      await this._storage?.set('dados_app', dados);
    }
  }

  /** Recupera a lista de garantias do armazenamento local. */
  async getGarantias() {
    const data = await this._storage?.get('dados_app');
    return data?.garantias || [];
  }

  /** Recupera a lista de grupos disponíveis no armazenamento local. */
  async getGrupos(): Promise<string[]> {
    const data = await this._storage?.get('dados_app');
    return data?.grupos || ["Tecnologia", "Cozinha", "Eletrodomésticos", "Ferramentas", "Outros"];
  }

  /** Remove um registo de garantia com base no identificador fornecido. */
  async removerGarantia(id: string) {
    let garantias = await this.getGarantias();
    garantias = garantias.filter((g: any) => g.id !== id);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit(); // Aciona a notificação de atualização
    }
  }

  /** Insere um novo registo de garantia no Firebase e no armazenamento local. */
  async adicionarGarantia(novaGarantia: any) {
    
    // --- PARTE 1: Guardar na Base de Dados na Nuvem (Firebase Firestore) ---
    try {
      // Criar uma cópia para não alterar a variável original com as fotos
      const garantiaParaNuvem = { ...novaGarantia };
      
      // Remover as fotos em Base64 para não ultrapassar o limite de 1MB do Firestore
      garantiaParaNuvem.fotoTalao = '';
      garantiaParaNuvem.fotoLocal = '';

      // Guardar na coleção 'garantias'
      const garantiasRef = collection(this.firestore, 'garantias');
      await addDoc(garantiasRef, garantiaParaNuvem);
      console.log('Sucesso: Garantia guardada na nuvem (Firebase)!');
    } catch (error) {
      console.error('Erro ao guardar garantia no Firebase:', error);
    }

    // --- PARTE 2: Guardar Localmente (Mantém a tua app atual a funcionar) ---
    let garantias = await this.getGarantias();
    
    // Guardar a versão ORIGINAL (com as fotos) na base de dados local
    garantias.push(novaGarantia);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit(); // Aciona a notificação de atualização
    }
  }

  /** Recupera os dados do utilizador a partir do ficheiro JSON de perfil. */
  async getPerfil() {
    try {
      const res = await fetch('/assets/data/perfil.json');
      const dados = await res.json();
      return dados.utilizador;
    } catch (error) {
      console.error('Erro ao ler o ficheiro de perfil:', error);
      return null;
    }
  }
}