import { Component, OnInit } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router'; 
import { ToastController } from '@ionic/angular'; // Importação do ToastController

// Registo de ícones do Ionic para a interface
import { addIcons } from 'ionicons';
import { 
  closeCircle, 
  peopleOutline, 
  shieldCheckmarkOutline, 
  notificationsOutline, 
  archiveOutline,
  checkmarkCircleOutline // Adicionado para o balão de sucesso
} from 'ionicons/icons';

// Serviço e Interface para gestão de dados
import { GarantiasService, Grupo } from '../../services/garantias.service';

@Component({
  selector: 'app-criar-grupo',
  templateUrl: './criar-grupo.page.html',
  styleUrls: ['./criar-grupo.page.scss'],
  standalone: false
})
export class CriarGrupoPage implements OnInit {
  
  // Controla o passo visível no formulário (1 a 4)
  passoAtual: number = 1;

  // Indica se estamos a editar um grupo existente
  emModoEdicao: boolean = false;

  // Dados do grupo (novos ou carregados para edição)
  novoGrupo: Grupo = {
    nome: '',
    adminEmail: '',
    membros: [],
    garantiasIds: [],
    alertaConfig: '1 semana antes'
  };

  // Variáveis auxiliares para o formulário
  novoMembroEmail: string = '';
  garantiasDisponiveis: any[] = []; 

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private garantiasService: GarantiasService,
    private toastController: ToastController // Injeção no construtor
  ) {
    // Registo de todos os ícones usados nesta página
    addIcons({ 
      closeCircle, 
      peopleOutline, 
      shieldCheckmarkOutline, 
      notificationsOutline, 
      archiveOutline,
      checkmarkCircleOutline 
    });
  }

  /** Lógica executada ao iniciar a página. */
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.emModoEdicao = true;
      // Procura o grupo na nuvem para preencher o formulário
      const perfil = await this.garantiasService.getPerfil();
      if (perfil) {
        const lista = await this.garantiasService.getGruposRemotos(perfil.email);
        const grupoAEditar = lista.find(g => g.id === id);
        if (grupoAEditar) {
          this.novoGrupo = { ...grupoAEditar };
        }
      }
    }
  }

  /** Atualiza dados sempre que a página entra em foco. */
  async ionViewWillEnter() {
    const perfil = await this.garantiasService.getPerfil();
    if (perfil && !this.emModoEdicao) {
      this.novoGrupo.adminEmail = perfil.email;
      // Garante que o criador está na lista se for um grupo novo
      if (!this.novoGrupo.membros.includes(perfil.email)) {
        this.novoGrupo.membros.push(perfil.email);
      }
    }
    await this.carregarGarantias();
  }

  /** Carrega as garantias pessoais para seleção. */
  async carregarGarantias() {
    this.garantiasDisponiveis = await this.garantiasService.getGarantias();
  }

  // --- GESTÃO DE MEMBROS ---
  
  /** Adiciona um membro à lista se for válido e não repetido. */
  adicionarMembro() {
    if (this.novoMembroEmail.trim() !== '' && !this.novoGrupo.membros.includes(this.novoMembroEmail)) {
      this.novoGrupo.membros.push(this.novoMembroEmail);
      this.novoMembroEmail = ''; 
    }
  }

  /** Remove um membro específico da lista. */
  removerMembro(email: string) {
    this.novoGrupo.membros = this.novoGrupo.membros.filter(m => m !== email);
  }

  // --- SELEÇÃO DE GARANTIAS ---

  /** Adiciona ou remove o ID de uma garantia selecionada. */
  toggleGarantia(id: string) {
    const index = this.novoGrupo.garantiasIds.indexOf(id);
    if (index === -1) {
      this.novoGrupo.garantiasIds.push(id); 
    } else {
      this.novoGrupo.garantiasIds.splice(index, 1); 
    }
  }

  /** Verifica se a garantia está selecionada para apresentar na interface. */
  isGarantiaSelecionada(id: string): boolean {
    return this.novoGrupo.garantiasIds.includes(id);
  }

  // --- NAVEGAÇÃO E FEEDBACK ---

  /** Avança para o passo seguinte do formulário. */
  avancarPasso() {
    if (this.passoAtual < 4) this.passoAtual++;
  }

  /** Recua para o passo anterior do formulário. */
  recuarPasso() {
    if (this.passoAtual > 1) this.passoAtual--;
  }

  /** Mostra uma notificação visual (Toast) no topo do ecrã. */
  async mostrarSucesso(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2500,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }

  /** Grava as alterações ou cria o grupo novo no Firebase. */
  async concluirCriacao() {
    let sucesso = false;

    if (this.emModoEdicao) {
      // Chama a função de edição no serviço
      await this.garantiasService.editarGrupo(this.novoGrupo);
      sucesso = true;
    } else {
      // Cria um grupo novo
      const id = await this.garantiasService.criarGrupo(this.novoGrupo);
      sucesso = !!id;
    }
    
    if (sucesso) {
      // Apresenta o feedback consoante a ação realizada
      const msg = this.emModoEdicao ? 'Grupo atualizado com sucesso!' : 'Grupo criado com sucesso!';
      await this.mostrarSucesso(msg);
      
      this.router.navigateByUrl('/tabs/tab2'); 
    }
  }
}