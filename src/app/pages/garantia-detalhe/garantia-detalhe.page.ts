import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GarantiasService } from '../../services/garantias.service'; 
import { ActionSheetController } from '@ionic/angular';
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

@Component({
  selector: 'app-garantia-detalhe',
  templateUrl: './garantia-detalhe.page.html',
  styleUrls: ['./garantia-detalhe.page.scss'],
  standalone: false
})
export class GarantiaDetalhePage implements OnInit {
  
  // Guarda os dados da garantia atualmente em visualização
  garantia: any = null;

  // Controla a visibilidade e a fonte da imagem do modal
  modalAberto = false;
  fotoEmDestaque = '';
  
  // Controla o estado de validade para ocultar botões de edição
  isExpirada: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private garantiasService: GarantiasService,
    private actionSheetCtrl: ActionSheetController
  ) {
    // Regista os ícones visuais da interface HTML
    addIcons({ cubeOutline, receiptOutline, storefrontOutline, eyeOutline, trashOutline, pencilOutline, closeOutline, informationCircleOutline });
  }

  async ngOnInit() {}

  // Carrega os dados atualizados sempre que o ecrã fica ativo
  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const lista = await this.garantiasService.getGarantias();
      this.garantia = lista.find((g: any) => g.id === id);

      // Compara a data de expiração com o dia atual para definir o estado de validade
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

  // Abre um modal com a imagem expandida do documento selecionado
  verDocumento(tipo: string) {
    const foto = tipo === 'talao' ? this.garantia?.fotoTalao : this.garantia?.fotoLocal;
    if (foto) {
      this.fotoEmDestaque = foto;
      this.modalAberto = true; 
    } else {
      alert('Nenhuma foto guardada para este documento.');
    }
  }

  // Encerra a visualização em ecrã inteiro da fotografia
  fecharModal() {
    this.modalAberto = false;
    this.fotoEmDestaque = '';
  }

  // Pede confirmação ao utilizador e elimina o registo ativo
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
                // ATENÇÃO: Verifica se o método no serviço se chama mesmo 'apagarGarantia'
                await this.garantiasService.apagarGarantia(this.garantia.id); 
                
                // Retorna ao separador principal após a eliminação
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

  // Redireciona o utilizador para o formulário de edição com o ID atual
  editarProduto() {
    if (this.garantia?.id) {
      this.router.navigate(['/registar-garantia', this.garantia.id]);
    }
  }
}