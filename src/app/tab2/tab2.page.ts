import { Component, OnInit } from '@angular/core';
// Substituímos o GruposService pelo GarantiasService para ler direto do Firebase
import { GarantiasService, Grupo } from '../services/garantias.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  
  // Variável que guarda o array de grupos a apresentar no ecrã
  grupos: Grupo[] = [];

  constructor(private garantiasService: GarantiasService) {}

  async ngOnInit() {
    // Subscreve as alterações no serviço para atualizar a lista se algo mudar
    this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarGrupos();
    });
  }

  /** Atualiza a lista SEMPRE que o separador é aberto (mata o problema de cache) */
  async ionViewWillEnter() {
    await this.carregarGrupos();
  }

  /** Método que vai buscar os grupos DIRETAMENTE à base de dados na Nuvem */
  async carregarGrupos() {
    // 1. Vai buscar o email do utilizador atual
    const perfil = await this.garantiasService.getPerfil();
    
    if (perfil) {
      // 2. Vai ao Firebase buscar apenas os grupos onde este email está inserido
      this.grupos = await this.garantiasService.getGruposRemotos(perfil.email);
      console.log('Grupos carregados do Firebase:', this.grupos);
    }
  }
}