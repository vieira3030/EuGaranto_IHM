import { Component, OnInit } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router'; 
import { ToastController } from '@ionic/angular';

// Importação da função de registo e respetivos ícones visuais do Ionic
import { addIcons } from 'ionicons';
import { 
  closeCircle, 
  people, 
  checkmarkCircleOutline,
  checkmarkOutline,
  addOutline,
  ellipseOutline,
  checkmarkCircle,
  chevronForwardOutline
} from 'ionicons/icons';

// Importação do serviço e da interface de estrutura de dados do grupo
import { GarantiasService, Grupo } from '../../services/garantias.service';

// Componente responsável pelo formulário de criação e edição de grupos
@Component({
  selector: 'app-criar-grupo',
  templateUrl: './criar-grupo.page.html',
  styleUrls: ['./criar-grupo.page.scss'],
  standalone: false
})
export class CriarGrupoPage implements OnInit {
  
  // Define o passo atual visível no formulário (varia entre 1 e 4)
  passoAtual: number = 1;

  // Define se o formulário opera em modo de edição ou de criação
  emModoEdicao: boolean = false;

  // Armazena a estrutura de dados do grupo em edição ou criação
  novoGrupo: Grupo = {
    nome: '',
    adminEmail: '',
    membros: [],
    garantiasIds: [],
    alertaConfig: '1 semana antes'
  };

  // Armazena temporariamente o email introduzido no campo de novo membro
  novoMembroEmail: string = '';
  
  // Lista com as garantias disponíveis para associação ao grupo
  garantiasDisponiveis: any[] = []; 

  // Construtor: inicializa os serviços de navegação, dados e interface
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private garantiasService: GarantiasService,
    private toastController: ToastController
  ) {
    // Regista os ícones necessários para apresentação no HTML
    addIcons({ 
      closeCircle, 
      people, 
      checkmarkCircleOutline,
      checkmarkOutline,
      addOutline,
      ellipseOutline,
      checkmarkCircle,
      chevronForwardOutline
    });
  }

  // Executado ao iniciar a página: verifica a existência de um ID para ativar o modo de edição
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.emModoEdicao = true;
      
      // Obtém o perfil local e procura o grupo correspondente na base de dados remota
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

 // Executado sempre que a página fica visível: define o criador e carrega a lista de garantias
  async ionViewWillEnter() {
    // Recupera o email do utilizador real que iniciou sessão através da memória local
    const emailLogado = localStorage.getItem('mockEmail');
    
    if (emailLogado && !this.emModoEdicao) {
      // Define o administrador do grupo como sendo o utilizador atual
      this.novoGrupo.adminEmail = emailLogado;
      
      // Insere automaticamente o email do criador na lista de membros do novo grupo
      if (!this.novoGrupo.membros.includes(emailLogado)) {
        this.novoGrupo.membros.push(emailLogado);
      }
    }
    
    // Obtém a lista completa de garantias para o passo seguinte
    await this.carregarGarantias();
  }

  // Obtém a lista completa de garantias guardadas no armazenamento local
  async carregarGarantias() {
    this.garantiasDisponiveis = await this.garantiasService.getGarantias();
  }

  // --- GESTÃO DE MEMBROS ---
  
  // Valida o texto inserido e adiciona o email à lista de membros, evitando duplicados
  adicionarMembro() {
    if (this.novoMembroEmail.trim() !== '' && !this.novoGrupo.membros.includes(this.novoMembroEmail)) {
      this.novoGrupo.membros.push(this.novoMembroEmail);
      this.novoMembroEmail = ''; 
    }
  }

  // Filtra a lista de membros para remover o email selecionado
  removerMembro(email: string) {
    this.novoGrupo.membros = this.novoGrupo.membros.filter(m => m !== email);
  }

  // --- SELEÇÃO DE GARANTIAS ---

  // Adiciona o ID da garantia à lista se não existir, ou remove-o caso já esteja presente
  toggleGarantia(id: string) {
    const index = this.novoGrupo.garantiasIds.indexOf(id);
    if (index === -1) {
      this.novoGrupo.garantiasIds.push(id); 
    } else {
      this.novoGrupo.garantiasIds.splice(index, 1); 
    }
  }

  // Valida se o ID de uma garantia específica consta na lista de garantias selecionadas
  isGarantiaSelecionada(id: string): boolean {
    return this.novoGrupo.garantiasIds.includes(id);
  }

  // --- NAVEGAÇÃO E FEEDBACK ---

  // Incrementa a variável de controlo para avançar na navegação do formulário
  avancarPasso() {
    if (this.passoAtual < 4) this.passoAtual++;
  }

  // Decrementa a variável de controlo para retroceder na navegação do formulário
  recuarPasso() {
    if (this.passoAtual > 1) this.passoAtual--;
  }

  // Apresenta uma notificação temporária de sucesso no topo do ecrã
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

 // Executa a gravação do grupo e redireciona o utilizador em caso de sucesso
  async concluirCriacao() {
    let sucesso = false;

    if (this.emModoEdicao) {
      // Atualiza os dados de um grupo já existente
      await this.garantiasService.editarGrupo(this.novoGrupo);
      sucesso = true;
    } else {
      // Regista a criação de um grupo inteiramente novo
      const id = await this.garantiasService.criarGrupo(this.novoGrupo);
      sucesso = !!id;
    }
    
    if (sucesso) {
      // Define a mensagem de feedback consoante o estado de edição ou criação e apresenta o Toast
      const msg = this.emModoEdicao ? 'Grupo atualizado com sucesso!' : 'Grupo criado com sucesso!';
      await this.mostrarSucesso(msg);
      
      // Dá uma folga de meio segundo (500ms) para o Firebase sincronizar os dados
      // antes de atirar o utilizador para a lista de grupos
      setTimeout(() => {
        this.router.navigateByUrl('/tabs/tab2'); 
      }, 500);
    }
  }
}