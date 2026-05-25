import { Component } from '@angular/core';
import { GarantiasService } from '../services/garantias.service'; // Importa o serviço de dados
import { AlertController } from '@ionic/angular'; // Importa o controlador de alertas nativos
import { addIcons } from 'ionicons'; // Importa a função de registo de ícones
// Adicionado o ícone personCircleOutline para o cabeçalho da página
import { createOutline, camera, personCircleOutline } from 'ionicons/icons'; 

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  
  perfil: any = null; // Armazena os dados do perfil do utilizador

  constructor(
    private garantiasService: GarantiasService,
    private alertController: AlertController 
  ) {
    // Regista os ícones necessários para o funcionamento da interface HTML
    addIcons({ createOutline, camera, personCircleOutline });
  }

  // Carrega as informações do perfil sempre que o ecrã fica ativo
  async ionViewWillEnter() {
    this.perfil = await this.garantiasService.getPerfil();
  }

  // Apresenta uma caixa de diálogo nativa para modificar o Nome e o Email
  async editarPerfil() {
    const alert = await this.alertController.create({
      header: 'Editar Perfil',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'O teu nome',
          value: this.perfil?.nome 
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'O teu email',
          value: this.perfil?.email 
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel' 
        },
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

  // Captura o ficheiro selecionado da galeria e converte-o para Base64
  alterarFoto(event: any) {
    const ficheiro = event.target.files[0];
    
    if (ficheiro) {
      const leitor = new FileReader();
      
      leitor.onload = () => {
        this.perfil.foto = leitor.result as string; 
        // this.garantiasService.atualizarPerfil(this.perfil);
      };
      
      leitor.readAsDataURL(ficheiro);
    }
  }

  // Limpa o estado atual e encerra a sessão ativa do utilizador
  terminarSessao() {
    console.log('Sessão terminada');
  }
}