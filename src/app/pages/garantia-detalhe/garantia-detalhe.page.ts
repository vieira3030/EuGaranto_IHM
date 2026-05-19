import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GarantiasService } from '../../services/garantias.service'; 
import { ActionSheetController } from '@ionic/angular';
import { addIcons } from 'ionicons';
// 1. Adicionámos o ícone 'closeOutline' à lista
import { cubeOutline, receiptOutline, storefrontOutline, eyeOutline, trashOutline, pencilOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-garantia-detalhe',
  templateUrl: './garantia-detalhe.page.html',
  styleUrls: ['./garantia-detalhe.page.scss'],
  standalone: false
})
export class GarantiaDetalhePage implements OnInit {
  
  garantia: any = null;

  // 2. Variáveis para controlar o modal da foto
  modalAberto = false;
  fotoEmDestaque = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private garantiasService: GarantiasService,
    private actionSheetCtrl: ActionSheetController
  ) {
    // 3. Registar o novo ícone
    addIcons({ cubeOutline, receiptOutline, storefrontOutline, eyeOutline, trashOutline, pencilOutline, closeOutline });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const lista = await this.garantiasService.getGarantias();
      this.garantia = lista.find((g: any) => g.id === id);
    }
  }

  // 4. Em vez de um alert, agora abre o modal com a foto grande!
  verDocumento(tipo: string) {
    const foto = tipo === 'talao' ? this.garantia?.fotoTalao : this.garantia?.fotoLocal;
    if (foto) {
      this.fotoEmDestaque = foto;
      this.modalAberto = true; // Abre a janela
    } else {
      alert('Nenhuma foto guardada para este documento.');
    }
  }

  // 5. Função para fechar o modal
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