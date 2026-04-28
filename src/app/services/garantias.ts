import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class GarantiasService {
  private _storage: Storage | null = null;
  // Evento que avisa quando a lista de garantias muda
  public dadosAlterados = new EventEmitter<void>();

  constructor(private storage: Storage) { 
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

  // A FUNÇÃO QUE FALTAVA
  async getGrupos(): Promise<string[]> {
    const data = await this._storage?.get('dados_app');
    return data?.grupos || ["Tecnologia", "Cozinha", "Eletrodomésticos", "Ferramentas", "Outros"];
  }

  async removerGarantia(id: string) {
    let garantias = await this.getGarantias();
    garantias = garantias.filter((g: any) => g.id !== id);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      // Avisa que os dados mudaram
      this.dadosAlterados.emit();
    }
  }

  // FUNÇÃO REPOSTA PARA QUANDO FIZERMOS O FORMULÁRIO
  async adicionarGarantia(novaGarantia: any) {
    let garantias = await this.getGarantias();
    garantias.push(novaGarantia);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      // Avisa que os dados mudaram
      this.dadosAlterados.emit();
    }
  }
}