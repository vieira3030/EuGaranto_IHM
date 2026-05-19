import { Component, OnInit } from '@angular/core';
// Serviço unificado para ler dados direto do Firebase
import { GarantiasService, Grupo } from '../services/garantias.service';

// Importar a função de registo de ícones e os respetivos ícones
import { addIcons } from 'ionicons';
import { peopleOutline, chevronForwardOutline, add } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  
  // Array de grupos a apresentar na interface
  grupos: Grupo[] = [];

  constructor(private garantiasService: GarantiasService) {
    // Regista os ícones para ficarem visíveis no HTML
    addIcons({ peopleOutline, chevronForwardOutline, add });
  }

  // Corre na primeira vez que a página é inicializada
  async ngOnInit() {
    // Subscreve alterações para atualizar a lista automaticamente
    this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarGrupos();
    });
  }

  // Atualiza a lista SEMPRE que o separador é aberto (evita cache)
  async ionViewWillEnter() {
    await this.carregarGrupos();
  }

  // Vai buscar os grupos DIRETAMENTE à base de dados na Nuvem
  async carregarGrupos() {
    // 1. Obtém o email do utilizador atual
    const perfil = await this.garantiasService.getPerfil();
    
    if (perfil) {
      // 2. Vai ao Firebase buscar apenas os grupos deste utilizador
      this.grupos = await this.garantiasService.getGruposRemotos(perfil.email);
      console.log('Grupos carregados do Firebase:', this.grupos);
    }
  }
}