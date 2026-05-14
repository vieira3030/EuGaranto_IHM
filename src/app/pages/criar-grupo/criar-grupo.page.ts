import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Registo de ícones do Ionic para a interface
import { addIcons } from 'ionicons';
import { 
  closeCircle, 
  peopleOutline, 
  shieldCheckmarkOutline, 
  notificationsOutline, 
  archiveOutline 
} from 'ionicons/icons';

// Serviços e Interfaces para gestão de dados
import { GruposService, Grupo } from '../../services/grupos';
import { GarantiasService } from '../../services/garantias.service';

@Component({
  selector: 'app-criar-grupo',
  templateUrl: './criar-grupo.page.html',
  styleUrls: ['./criar-grupo.page.scss'],
  standalone: false
})
export class CriarGrupoPage {
  
  // Controla o passo visível no formulário (1 a 4)
  passoAtual: number = 1;

  // Dados do novo grupo a enviar para o Firebase
  novoGrupo: Grupo = {
    nome: '',
    adminEmail: '',
    membros: [],
    garantiasIds: [], // Apenas os IDs das garantias para otimização
    alertaConfig: '1 semana antes'
  };

  // Variáveis auxiliares para o formulário
  novoMembroEmail: string = '';
  garantiasDisponiveis: any[] = []; 

  constructor(
    private router: Router, 
    private gruposService: GruposService,
    private garantiasService: GarantiasService 
  ) {
    // Registo obrigatório dos ícones utilizados no HTML
    addIcons({ 
      closeCircle, 
      peopleOutline, 
      shieldCheckmarkOutline, 
      notificationsOutline, 
      archiveOutline 
    });
  }

  // Executado sempre que a página fica visível
  async ionViewWillEnter() {
    const perfil = await this.garantiasService.getPerfil();
    if (perfil) {
      this.novoGrupo.adminEmail = perfil.email;
      // Garante que o criador faz parte da lista de membros
      if (!this.novoGrupo.membros.includes(perfil.email)) {
        this.novoGrupo.membros.push(perfil.email);
      }
    }
    await this.carregarGarantias();
  }

  // Obtém a lista de garantias pessoais do utilizador
  async carregarGarantias() {
    this.garantiasDisponiveis = await this.garantiasService.getGarantias();
  }

  // --- PASSO 1: GESTÃO DE MEMBROS ---
  
  // Adiciona um novo email à lista de membros do grupo
  adicionarMembro() {
    if (this.novoMembroEmail.trim() !== '' && !this.novoGrupo.membros.includes(this.novoMembroEmail)) {
      this.novoGrupo.membros.push(this.novoMembroEmail);
      this.novoMembroEmail = ''; // Limpa o campo após adicionar
    }
  }

  // Remove um membro da lista
  removerMembro(email: string) {
    this.novoGrupo.membros = this.novoGrupo.membros.filter(m => m !== email);
  }

  // --- PASSO 2: SELEÇÃO DE GARANTIAS ---

  // Alterna a seleção de uma garantia (adiciona ou remove ID)
  toggleGarantia(id: string) {
    const index = this.novoGrupo.garantiasIds.indexOf(id);
    if (index === -1) {
      this.novoGrupo.garantiasIds.push(id); 
    } else {
      this.novoGrupo.garantiasIds.splice(index, 1); 
    }
  }

  // Verifica se uma garantia está selecionada para atualizar a checkbox
  isGarantiaSelecionada(id: string): boolean {
    return this.novoGrupo.garantiasIds.includes(id);
  }

  // --- NAVEGAÇÃO ---

  // Avança para o próximo passo do wizard
  avancarPasso() {
    if (this.passoAtual < 4) this.passoAtual++;
  }

  // Retrocede para o passo anterior
  recuarPasso() {
    if (this.passoAtual > 1) this.passoAtual--;
  }

  // Finaliza a criação, grava no Firebase e regressa à lista de grupos
  async concluirCriacao() {
    const idSucesso = await this.gruposService.criarGrupoRemote(this.novoGrupo);
    
    if (idSucesso) {
      console.log('Sucesso: Grupo criado no Firebase');
      
      // Reset do formulário antes de navegar
      this.passoAtual = 1;
      this.novoGrupo.nome = '';
      this.novoGrupo.garantiasIds = [];
      
      this.router.navigateByUrl('/tabs/tab2'); 
    }
  }
}