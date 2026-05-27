// Importação dos módulos nucleares do Angular
import { Component } from '@angular/core';

// Importação do serviço de gestão de dados e do controlador de alertas nativos do Ionic
import { GarantiasService } from '../services/garantias.service'; 
import { AlertController } from '@ionic/angular'; 

// Importação da função de registo e respetivos ícones visuais
import { addIcons } from 'ionicons'; 
import { createOutline, camera, personCircleOutline } from 'ionicons/icons'; 

// Componente responsável por apresentar e gerir a página de perfil de utilizador (Tab 3)
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  
  // Objeto que armazena os dados do perfil do utilizador atualmente autenticado
  perfil: any = null; 

  // Construtor: inicializa os serviços de dados e alertas, e regista os ícones para a interface
  constructor(
    private garantiasService: GarantiasService,
    private alertController: AlertController 
  ) {
    addIcons({ createOutline, camera, personCircleOutline });
  }

  // Executado sempre que a página fica visível: carrega os dados atualizados do perfil
  async ionViewWillEnter() {
    this.perfil = await this.garantiasService.getPerfil();
  }

  // Apresenta uma caixa de diálogo nativa (Alert) com campos de texto para edição dos dados pessoais
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
            // Valida o preenchimento dos campos e atualiza o estado local do perfil
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

  // Interceta a seleção de um ficheiro de imagem e converte os seus dados para o formato Base64
  alterarFoto(event: any) {
    const ficheiro = event.target.files[0];
    
    if (ficheiro) {
      const leitor = new FileReader();
      
      leitor.onload = () => {
        // Atribui a string em Base64 à propriedade da fotografia do perfil
        this.perfil.foto = leitor.result as string; 
        // this.garantiasService.atualizarPerfil(this.perfil);
      };
      
      leitor.readAsDataURL(ficheiro);
    }
  }

  // Executa os procedimentos necessários para limpar o estado e encerrar a sessão
  terminarSessao() {
    console.log('Sessão terminada');
  }
}