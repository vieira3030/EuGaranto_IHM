// Importação dos módulos nucleares do Angular e do Ionic
import { Component } from '@angular/core';
import { GarantiasService } from '../services/garantias.service'; 
import { AlertController } from '@ionic/angular'; 
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons'; 
import { createOutline, camera, personCircleOutline, person } from 'ionicons/icons'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  // Objeto que armazena a informação a apresentar no perfil
  perfil: any = null; 

  constructor(
    private garantiasService: GarantiasService,
    private alertController: AlertController,
    private router: Router
  ) {
    // Registo dos ícones (adicionei o ícone 'person' genérico)
    addIcons({ createOutline, camera, personCircleOutline, person });
  }

  // Método executado sempre que a página é carregada
  async ionViewWillEnter() {
    this.perfil = await this.garantiasService.getPerfil();
    
    // Recupera os dados dinâmicos da memória local
    const nomeGuardado = localStorage.getItem('mockNome');
    const emailGuardado = localStorage.getItem('mockEmail');
    const fotoGuardada = localStorage.getItem('mockFoto'); // Procura a foto na memória
    
    // Atualiza a interface com a informação real
    if (nomeGuardado) this.perfil.nome = nomeGuardado;
    if (emailGuardado) this.perfil.email = emailGuardado;

    // Se o utilizador já tirou foto, usa-a. Se for conta nova, anula a foto de teste.
    if (fotoGuardada) {
      this.perfil.foto = fotoGuardada;
    } else {
      this.perfil.foto = null; 
    }
  }

  // Abre uma janela para modificar os dados de texto
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
              localStorage.setItem('mockNome', dados.nome);
              localStorage.setItem('mockEmail', dados.email);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // Aciona a câmara nativa e guarda o resultado
  async alterarFoto() {
    try {
      const imagem = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt 
      });

      if (imagem.dataUrl) {
        this.perfil.foto = imagem.dataUrl; 
        // Guarda a nova foto permanentemente na memória local do dispositivo
        localStorage.setItem('mockFoto', imagem.dataUrl);
      }
    } catch (erro) {
      console.log('O utilizador fechou a câmara sem tirar foto.', erro);
    }
  }

  // Encerra a sessão
  terminarSessao() {
    console.log('Sessão terminada');
    localStorage.removeItem('session_active'); 
    this.router.navigateByUrl('/login'); 
  }
}