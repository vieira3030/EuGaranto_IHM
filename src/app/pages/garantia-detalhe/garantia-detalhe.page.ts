// Importações dos módulos centrais do Angular, serviços de navegação e dados
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GarantiasService } from '../../services/garantias.service'; 
import { ActionSheetController } from '@ionic/angular';

// Importação da função de registo e respetivos ícones da biblioteca Ionic
import { addIcons } from 'ionicons';
import { 
  cubeOutline, 
  receiptOutline, 
  storefrontOutline, 
  eyeOutline, 
  trashOutline, 
  pencilOutline, 
  closeOutline,
  informationCircleOutline 
} from 'ionicons/icons';

// Componente responsável por apresentar a informação detalhada de uma garantia individual
@Component({
  selector: 'app-garantia-detalhe',
  templateUrl: './garantia-detalhe.page.html',
  styleUrls: ['./garantia-detalhe.page.scss'],
  standalone: false
})
export class GarantiaDetalhePage implements OnInit {
  
  // Objeto que armazena toda a informação da garantia carregada no ecrã
  garantia: any = null;

  // Variável de controlo para apresentar ou ocultar o modal de visualização da imagem
  modalAberto = false;
  
  // Armazena a fonte de dados (URL ou Base64) da fotografia a apresentar no modal
  fotoEmDestaque = '';
  
  // Sinalizador booleano que indica se o prazo da garantia já foi ultrapassado
  isExpirada: boolean = false;

  // Construtor: inicializa os serviços de rota, dados e menus de interface
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private garantiasService: GarantiasService,
    private actionSheetCtrl: ActionSheetController
  ) {
    // Regista os ícones visuais para utilização na estrutura HTML desta página
    addIcons({ cubeOutline, receiptOutline, storefrontOutline, eyeOutline, trashOutline, pencilOutline, closeOutline, informationCircleOutline });
  }

  // Método do ciclo de vida do Angular executado na inicialização do componente
  async ngOnInit() {}

  // Executado ao entrar na página. Extrai o ID da rota, localiza a garantia e valida a validade
  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // Obtém o catálogo completo e isola o registo com o ID correspondente
      const lista = await this.garantiasService.getGarantias();
      this.garantia = lista.find((g: any) => g.id === id);

      // Compara a data de expiração da garantia com a data atual do sistema
      if (this.garantia && this.garantia.dataExpiracao) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); 
        const dataExp = new Date(this.garantia.dataExpiracao);
        
        this.isExpirada = dataExp < hoje;
      } else {
        this.isExpirada = false;
      }
    }
  }

  // Prepara e exibe o modal em ecrã inteiro com a fotografia do talão ou do local
  verDocumento(tipo: string) {
    const foto = tipo === 'talao' ? this.garantia?.fotoTalao : this.garantia?.fotoLocal;
    
    if (foto) {
      this.fotoEmDestaque = foto;
      this.modalAberto = true; 
    } else {
      alert('Nenhuma foto guardada para este documento.');
    }
  }

  // Oculta o modal de visualização fotográfica e limpa a variável da imagem
  fecharModal() {
    this.modalAberto = false;
    this.fotoEmDestaque = '';
  }

  // Apresenta um menu de confirmação nativo e executa a remoção definitiva do produto
  async apagarProduto() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Eliminar Garantia',
      subHeader: 'Tem a certeza? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash-outline',
          handler: async () => {
            try {
              if (this.garantia?.id) {
                // Invoca o serviço de gestão para apagar o registo local e remoto
                await this.garantiasService.apagarGarantia(this.garantia.id); 
                
                // Redireciona o utilizador de volta para o separador principal
                this.router.navigate(['/tabs/tab1']);
              }
            } catch (erro) {
              console.error('Falha ao eliminar a garantia:', erro);
            }
          }
        },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });

    await actionSheet.present();
  }

  // Redireciona o utilizador para a página de edição, passando o identificador da garantia atual
  editarProduto() {
    if (this.garantia?.id) {
      this.router.navigate(['/registar-garantia', this.garantia.id]);
    }
  }
}