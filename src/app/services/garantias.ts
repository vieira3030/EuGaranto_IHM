import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class GarantiasService {
  private _storage: Storage | null = null;
  
  /** Evento emitido para notificar os componentes sobre alterações na base de dados local. */
  public dadosAlterados = new EventEmitter<void>();

  constructor(private storage: Storage) { 
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

  /** Insere um novo registo de garantia no armazenamento local. */
  async adicionarGarantia(novaGarantia: any) {
    let garantias = await this.getGarantias();
    garantias.push(novaGarantia);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit(); // Aciona a notificação de atualização
    }
  }
}