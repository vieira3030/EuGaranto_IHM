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
  informationCircleOutline // Ícone novo para o alerta
} from 'ionicons/icons';

@Component({
  selector: 'app-garantia-detalhe',
  templateUrl: './garantia-detalhe.page.html',
  styleUrls: ['./garantia-detalhe.page.scss'],
  standalone: false
})
export class GarantiaDetalhePage implements OnInit {
  
  garantia: any = null;

  // Variáveis para controlar o modal da foto
  modalAberto = false;
  fotoEmDestaque = '';
  
  // Variável para saber se a garantia está expirada
  isExpirada: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private garantiasService: GarantiasService,
    private actionSheetCtrl: ActionSheetController
  ) {
    // Registar todos os ícones necessários
    addIcons({ cubeOutline, receiptOutline, storefrontOutline, eyeOutline, trashOutline, pencilOutline, closeOutline, informationCircleOutline });
  }

  async ngOnInit() {
    // O carregamento é feito no ionViewWillEnter para garantir que os dados estão atualizados
  }

  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const lista = await this.garantiasService.getGarantias();
      this.garantia = lista.find((g: any) => g.id === id);

      if (this.garantia && this.garantia.dataExpiracao) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Ignora as horas para comparar só o dia
        const dataExp = new Date(this.garantia.dataExpiracao);
        
        this.isExpirada = dataExp < hoje;
      } else {
        this.isExpirada = false;
      }
    }
  }

  // Abre o modal com a foto grande
  verDocumento(tipo: string) {
    const foto = tipo === 'talao' ? this.garantia?.fotoTalao : this.garantia?.fotoLocal;
    if (foto) {
      this.fotoEmDestaque = foto;
      this.modalAberto = true; 
    } else {
      alert('Nenhuma foto guardada para este documento.');
    }
  }

  // Função para fechar o modal
  fecharModal() {
    this.modalAberto = false;
    this.fotoEmDestaque = '';
  }

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
            if (this.garantia?.id) {
              await this.garantiasService.apagarGarantia(this.garantia.id); 
              this.router.navigate(['/tabs/tab1']);
            }
          }
        },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });

    await actionSheet.present();
  }

  editarProduto() {
    if (this.garantia?.id) {
      this.router.navigate(['/registar-garantia', this.garantia.id]);
    }
  }
}