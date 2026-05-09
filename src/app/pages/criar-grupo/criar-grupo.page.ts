import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Registo de ícones
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';

// Serviços (Atenção: garante que o caminho e o nome do teu serviço de garantias estão corretos)
import { GruposService } from '../../services/grupos';
import { GarantiasService } from '../../services/garantias';
@Component({
  selector: 'app-criar-grupo',
  templateUrl: './criar-grupo.page.html',
  styleUrls: ['./criar-grupo.page.scss'],
  standalone: false
})
export class CriarGrupoPage {
  
  // Controlo do formulário
  passoAtual: number = 1;

  // Estrutura base do novo grupo
  novoGrupo: any = {
    id: Date.now().toString(),
    nome: '',
    membros: [],
    garantiasPartilhadas: [],
    alertasMembros: {}
  };

  // Variável para o campo de input
  novoMembroEmail: string = '';

  // Lista dinâmica (agora começa vazia)
  garantiasDisponiveis: any[] = [];

  constructor(
    private router: Router, 
    private gruposService: GruposService,
    private garantiasService: GarantiasService // Injeção do serviço das garantias
  ) {
    addIcons({ closeCircle });
  }

  // Executa sempre que a página fica visível, garantindo dados atualizados
  async ionViewWillEnter() {
    await this.carregarGarantias();
  }

  // Vai buscar as garantias à base de dados através do serviço
  async carregarGarantias() {
    // Substitui 'obterGarantias()' pelo nome exato do método que tens no teu serviço
   const garantiasGuardadas = await this.garantiasService.getGarantias()
    
    // Se houver garantias guarda-as, se não, fica array vazio
    this.garantiasDisponiveis = garantiasGuardadas ? garantiasGuardadas : [];
  }

  // --- LÓGICA DO PASSO 1: MEMBROS ---
  
  adicionarMembro() {
    if (this.novoMembroEmail.trim() !== '' && !this.novoGrupo.membros.includes(this.novoMembroEmail)) {
      this.novoGrupo.membros.push(this.novoMembroEmail);
      this.novoGrupo.alertasMembros[this.novoMembroEmail] = '1 semana antes';
      this.novoMembroEmail = '';
    }
  }

  removerMembro(email: string) {
    this.novoGrupo.membros = this.novoGrupo.membros.filter((m: string) => m !== email);
    delete this.novoGrupo.alertasMembros[email];
  }

  // --- LÓGICA DO PASSO 2: GARANTIAS ---

  toggleGarantia(garantia: any) {
    const index = this.novoGrupo.garantiasPartilhadas.findIndex((g: any) => g.id === garantia.id);
    if (index === -1) {
      this.novoGrupo.garantiasPartilhadas.push(garantia);
    } else {
      this.novoGrupo.garantiasPartilhadas.splice(index, 1);
    }
  }

  isGarantiaSelecionada(id: number): boolean {
    return this.novoGrupo.garantiasPartilhadas.some((g: any) => g.id === id);
  }

  // --- LÓGICA DE NAVEGAÇÃO E GRAVAÇÃO ---

  avancarPasso() {
    if (this.passoAtual < 4) {
      this.passoAtual++;
    }
  }

  recuarPasso() {
    if (this.passoAtual > 1) {
      this.passoAtual--;
    }
  }

  async concluirCriacao() {
    await this.gruposService.adicionarGrupo(this.novoGrupo);
    this.router.navigateByUrl('/tabs/tab2');
  }
}