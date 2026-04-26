import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class GarantiasService {
  private _storage: Storage | null = null;
  private garantias: any[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa a base de dados local
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.carregarDados();
  }

  // Verifica se já há dados guardados. Se não houver, vai ler ao ficheiro JSON.
  private async carregarDados() {
    const dadosGuardados = await this._storage?.get('garantias');
    
    if (dadosGuardados) {
      this.garantias = dadosGuardados;
    } else {
      const resposta = await fetch('/assets/data/garantias.json');
      const json = await resposta.json();
      this.garantias = json.garantias;
      await this._storage?.set('garantias', this.garantias); // Guarda na memória
    }
  }

  // === MÉTODOS CRUD ===

  // 1. LER: Devolve a lista atual
  async getGarantias() {
    // Garante que o storage inicializou antes de devolver os dados
    if (!this._storage) await this.init(); 
    return this.garantias;
  }

  // 2. INSERIR: Adiciona uma nova e atualiza a base de dados
  async adicionarGarantia(novaGarantia: any) {
    this.garantias.push(novaGarantia);
    await this._storage?.set('garantias', this.garantias);
  }

  // 3. REMOVER: Filtra a lista (tira o ID escolhido) e atualiza a base de dados
  async removerGarantia(id: string) {
    this.garantias = this.garantias.filter(g => g.id !== id);
    await this._storage?.set('garantias', this.garantias);
  }
}