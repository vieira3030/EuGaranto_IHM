import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * Serviço responsável pela gestão de dados das garantias e grupos.
 * Faz a ponte entre a aplicação e o armazenamento local (Ionic Storage).
 */
@Injectable({
  providedIn: 'root'
})
export class GarantiasService {
  // Variável para guardar a instância da base de dados local
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init(); // Inicializa o armazenamento assim que o serviço é chamado
  }

  /**
   * Cria a base de dados local e carrega os dados iniciais.
   */
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.carregarDadosIniciais();
  }

  /**
   * Verifica se já existem dados guardados. Se não existirem,
   * carrega os dados de teste a partir do ficheiro JSON.
   */
  private async carregarDadosIniciais() {
    const jaTemDados = await this._storage?.get('dados_app');
    if (!jaTemDados) {
      const res = await fetch('/assets/data/garantias.json');
      const dados = await res.json();
      await this._storage?.set('dados_app', dados);
    }
  }

  /**
   * Recupera a lista de garantias guardadas no Storage.
   * @returns Array de objetos de garantias.
   */
  async getGarantias() {
    const data = await this._storage?.get('dados_app');
    return data?.garantias || [];
  }

  /**
   * Recupera a lista de grupos (categorias) disponíveis.
   * @returns Array de strings com os nomes dos grupos.
   */
  async getGrupos(): Promise<string[]> {
    const data = await this._storage?.get('dados_app');
    return data?.grupos || ["Tecnologia", "Cozinha", "Eletrodomésticos", "Ferramentas", "Outros"];
  }
}