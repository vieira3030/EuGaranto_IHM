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

  /**
   * Remove uma garantia da base de dados local com base no seu ID.
   */
  async removerGarantia(id: string) {
    let garantias = await this.getGarantias();
    // Filtra a lista, removendo o item que tem o ID igual ao que queremos apagar
    garantias = garantias.filter((g: any) => g.id !== id);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais); // Atualiza o Storage
    }
  }

  /**
   * Adiciona uma nova garantia à base de dados local.
   */
  async adicionarGarantia(novaGarantia: any) {
    let garantias = await this.getGarantias();
    garantias.push(novaGarantia);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais); // Atualiza o Storage
    }
  }
}