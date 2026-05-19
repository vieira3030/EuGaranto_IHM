import { Component } from '@angular/core';
import { GarantiasService } from '../services/garantias.service'; // Importa o serviço
import { AlertController } from '@ionic/angular'; // Importa o controlador de alertas
import { addIcons } from 'ionicons'; // Importa a função de registo de ícones
import { createOutline, camera } from 'ionicons/icons'; // Ícones para a interface

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  // Variável para guardar os dados do utilizador
  perfil: any = null;

  constructor(
    private garantiasService: GarantiasService,
    private alertController: AlertController // Injeta o AlertController
  ) {
    // Regista os ícones para serem usados no HTML
    addIcons({ createOutline, camera });
  }

  // Carrega os dados sempre que o utilizador entra na tab
  async ionViewWillEnter() {
    this.perfil = await this.garantiasService.getPerfil();
  }

  // Abre uma caixa de diálogo para editar apenas Nome e Email
  async editarPerfil() {
    const alert = await this.alertController.create({
      header: 'Editar Perfil',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'O teu nome',
          value: this.perfil?.nome // Mostra o nome atual
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'O teu email',
          value: this.perfil?.email // Mostra o email atual
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel' // Fecha sem guardar
        },
        {
          text: 'Guardar',
          handler: async (dados) => {
            // Garante que o nome e email estão preenchidos
            if (dados.nome && dados.email) {
              
              // Atualiza os dados visualmente no ecrã
              this.perfil.nome = dados.nome;
              this.perfil.email = dados.email;

              // NOTA: Descomentar para guardar na base de dados
              // await this.garantiasService.atualizarPerfil(this.perfil);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Função para abrir a galeria e alterar a foto diretamente
  alterarFoto(event: any) {
    // Apanha a imagem que o utilizador selecionou
    const ficheiro = event.target.files[0];
    
    if (ficheiro) {
      const leitor = new FileReader();
      
      // Quando o ficheiro for lido, atualiza a foto do perfil
      leitor.onload = () => {
        this.perfil.foto = leitor.result as string; // Converte a imagem para Base64
        
        // NOTA: Descomentar para guardar na base de dados
        // this.garantiasService.atualizarPerfil(this.perfil);
      };
      
      // Inicia a leitura do ficheiro
      leitor.readAsDataURL(ficheiro);
    }
  }

  // Função para o botão de sair
  terminarSessao() {
    console.log('Sessão terminada');
  }
}