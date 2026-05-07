import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// 1. IMPORTANTE: Adicionados IonButtons e IonBackButton para o HTML não dar erro
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, 
  IonInput, IonButton, IonList, IonLabel, IonIcon, IonCheckbox, 
  IonSelect, IonSelectOption, IonFooter, IonButtons, IonBackButton
} from '@ionic/angular/standalone';

// Importa os ícones que vamos usar (ex: botão de fechar/apagar)
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';

// Importa o serviço que faz a ligação à base de dados local
import { GruposService } from '../../services/grupos';

@Component({
  selector: 'app-criar-grupo',
  templateUrl: './criar-grupo.page.html',
  styleUrls: ['./criar-grupo.page.scss'],
  standalone: true,
  // 2. IMPORTANTE: Declarar todos os componentes visuais para o Angular os reconhecer
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonItem, IonInput, IonButton, IonList, IonLabel, IonIcon, IonCheckbox, 
    IonSelect, IonSelectOption, IonFooter, IonButtons, IonBackButton
  ]
})
export class CriarGrupoPage implements OnInit {
  
  // Variável que controla em que ecrã do formulário o utilizador está
  passoAtual: number = 1;

  // Objeto principal que vai guardar toda a informação do novo grupo
  novoGrupo: any = {
    id: Date.now().toString(), // Gera um ID único baseado na data atual
    nome: '',
    membros: [], // Array de emails
    garantiasPartilhadas: [], // Array com os produtos escolhidos
    alertasMembros: {} // Dicionário que guarda o tipo de alerta para cada email
  };

  // Variável temporária ligada ao campo de texto para adicionar o email
  novoMembroEmail: string = '';

  // Array simulado que representa as garantias que o utilizador já tem na app
  garantiasDisponiveis: any[] = [
    { id: 1, nome: 'Televisor Samsung', dataExpiracao: '2026-05-07' },
    { id: 2, nome: 'iPhone 16', dataExpiracao: '2025-10-21' },
    { id: 3, nome: 'Máquina de Lavar', dataExpiracao: '2027-05-07' }
  ];

  constructor(
    private router: Router, 
    private gruposService: GruposService // Injeta o serviço da base de dados
  ) {
    // Regista o ícone de 'X' vermelho para se poder apagar membros
    addIcons({ closeCircle });
  }

  ngOnInit() {}

  // --- LÓGICA DO PASSO 1: MEMBROS ---

  // Função disparada pelo botão "Adicionar" no ecrã dos membros
  adicionarMembro() {
    // Só adiciona se o campo não estiver vazio e se o email ainda não existir na lista
    if (this.novoMembroEmail.trim() !== '' && !this.novoGrupo.membros.includes(this.novoMembroEmail)) {
      this.novoGrupo.membros.push(this.novoMembroEmail);
      // Define logo por defeito que o novo membro recebe alerta "1 semana antes"
      this.novoGrupo.alertasMembros[this.novoMembroEmail] = '1 semana antes';
      this.novoMembroEmail = ''; // Limpa o campo de texto para o próximo
    }
  }

  // Função que apaga um email caso o utilizador clique no 'X' vermelho
  removerMembro(email: string) {
    this.novoGrupo.membros = this.novoGrupo.membros.filter((m: string) => m !== email);
    delete this.novoGrupo.alertasMembros[email]; // Limpa as definições de alerta desse membro
  }

  // --- LÓGICA DO PASSO 2: GARANTIAS ---

  // Função que adiciona ou remove uma garantia do grupo quando se clica na Checkbox
  toggleGarantia(garantia: any) {
    const index = this.novoGrupo.garantiasPartilhadas.findIndex((g: any) => g.id === garantia.id);
    if (index === -1) {
      this.novoGrupo.garantiasPartilhadas.push(garantia); // Se não estava selecionada, adiciona
    } else {
      this.novoGrupo.garantiasPartilhadas.splice(index, 1); // Se já estava, remove
    }
  }

  // Verifica se a checkbox deve estar marcada ou desmarcada
  isGarantiaSelecionada(id: number): boolean {
    return this.novoGrupo.garantiasPartilhadas.some((g: any) => g.id === id);
  }

  // --- LÓGICA DE NAVEGAÇÃO E GRAVAÇÃO ---

  // Avança para o próximo ecrã do formulário
  avancarPasso() {
    if (this.passoAtual < 4) {
      this.passoAtual++;
    }
  }

  // Recua para o ecrã anterior do formulário
  recuarPasso() {
    if (this.passoAtual > 1) {
      this.passoAtual--;
    }
  }

  // Função final executada no Passo 4 para gravar na base de dados
  async concluirCriacao() {
    // 1. Envia o objeto completo do grupo para o serviço que gere o Ionic Storage
    await this.gruposService.adicionarGrupo(this.novoGrupo);
    
    // 2. Força o redirecionamento imediato para o ecrã "Meus Grupos" (Tab2)
    this.router.navigateByUrl('/tabs/tab2');
  }
}