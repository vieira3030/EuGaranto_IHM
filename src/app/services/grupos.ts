import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  // Variável privada para guardar a instância da base de dados local
  private _storage: Storage | null = null;
  
  // Emissor de eventos para avisar outras páginas quando os dados mudam
  dadosAlterados = new Subject<void>();

  constructor(private storage: Storage) {
    this.init(); // Inicializa a base de dados ao arrancar o serviço
  }

  // Método para criar e preparar o Ionic Storage
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Retorna todos os grupos guardados ou um array vazio se não houver nenhum
  async getGrupos() {
    if (!this._storage) await this.init();
    const grupos = await this._storage?.get('grupos');
    return grupos || [];
  }

  // Procura e devolve apenas o grupo que corresponda ao ID recebido
  async getGrupo(id: string) {
    const grupos = await this.getGrupos();
    return grupos.find((g: any) => g.id === id);
  }

  // Adiciona um novo grupo ao Storage e avisa a aplicação da mudança
  async adicionarGrupo(grupo: any) {
    const grupos = await this.getGrupos();
    grupos.push(grupo);
    await this._storage?.set('grupos', grupos);
    this.dadosAlterados.next(); // Dispara o aviso de atualização
  }
}