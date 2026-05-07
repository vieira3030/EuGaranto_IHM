import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  private _storage: Storage | null = null;
  dadosAlterados = new Subject<void>(); // Para avisar as páginas que há grupos novos

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async getGrupos() {
    if (!this._storage) await this.init();
    const grupos = await this._storage?.get('grupos');
    return grupos || [];
  }

  async adicionarGrupo(grupo: any) {
    const grupos = await this.getGrupos();
    grupos.push(grupo);
    await this._storage?.set('grupos', grupos);
    this.dadosAlterados.next(); // Atualiza as listas automaticamente
  }
}