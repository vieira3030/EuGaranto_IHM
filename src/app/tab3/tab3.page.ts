// Importação dos módulos nucleares do Angular
import { Component } from '@angular/core';

// Importação do serviço de gestão de dados e do controlador de alertas nativos
import { GarantiasService } from '../services/garantias.service'; 
import { AlertController } from '@ionic/angular'; 

// Importação do plugin nativo de Câmara do Capacitor
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Importação da função de registo e respetivos ícones visuais
import { addIcons } from 'ionicons'; 
import { createOutline, camera, personCircleOutline } from 'ionicons/icons'; 

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  
  // Objeto que armazena os dados do perfil
  perfil: any = null; 

  constructor(
    private garantiasService: GarantiasService,
    private alertController: AlertController 
  ) {
    addIcons({ createOutline, camera, personCircleOutline });
  }

  async ionViewWillEnter() {
    this.perfil = await this.garantiasService.getPerfil();
  }

  async editarPerfil() {
    const alert = await this.alertController.create({
      header: 'Editar Perfil',
      inputs: [
        { name: 'nome', type: 'text', placeholder: 'O teu nome', value: this.perfil?.nome },
        { name: 'email', type: 'email', placeholder: 'O teu email', value: this.perfil?.email }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (dados) => {
            if (dados.nome && dados.email) {
              this.perfil.nome = dados.nome;
              this.perfil.email = dados.email;
              // await this.garantiasService.atualizarPerfil(this.perfil);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Abre o menu nativo para escolher entre Câmara ou Galeria
  async alterarFoto() {
    try {
      const imagem = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Retorna logo a imagem em formato Base64
        source: CameraSource.Prompt // É isto que força a aparecer o menu de escolha (Câmara/Galeria)
      });

      if (imagem.dataUrl) {
        this.perfil.foto = imagem.dataUrl; 
        // this.garantiasService.atualizarPerfil(this.perfil);
      }
    } catch (erro) {
      console.log('O utilizador fechou a câmara sem tirar foto.', erro);
    }
  }

  // Executa os procedimentos necessários para terminar a sessão
  terminarSessao() {
    console.log('Sessão terminada');
  }
}