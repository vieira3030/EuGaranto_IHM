// Importações nucleares do Angular e do Ionic
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  // Controla o estado do formulário (true = Iniciar Sessão, false = Criar Conta)
  modoLogin: boolean = true; 
  
  // Variáveis para guardar o texto dos inputs
  nome: string = '';
  email: string = '';
  palavraPasse: string = '';

  constructor(private router: Router, private toastCtrl: ToastController) {}

  // Alterna entre os ecrãs de Login e Registo e limpa os campos
  alternarModo() {
    this.modoLogin = !this.modoLogin;
    this.nome = '';
    this.email = '';
    this.palavraPasse = '';
  }

  // Lida com o processo de autenticação simulado
  async submeter() {
    // Valida se os campos obrigatórios estão preenchidos
    if (!this.email || !this.palavraPasse || (!this.modoLogin && !this.nome)) {
      this.mostrarAviso('Por favor, preenche todos os campos necessários.', 'danger');
      return;
    }

    if (!this.modoLogin) {
      // --- FLUXO DE CRIAR CONTA ---
      // Guarda as credenciais na memória local do navegador
      localStorage.setItem('mockEmail', this.email);
      localStorage.setItem('mockPassword', this.palavraPasse);
      
      await this.mostrarAviso('Conta criada com sucesso! Já podes iniciar sessão.', 'success');
      this.alternarModo(); // Alterna automaticamente para o modo de login
      
    } else {
      // --- FLUXO DE INICIAR SESSÃO ---
      // Vai buscar as credenciais guardadas na memória local
      const emailGuardado = localStorage.getItem('mockEmail');
      const passwordGuardada = localStorage.getItem('mockPassword');

      // Verifica se a conta existe e se os dados coincidem
      if (this.email === emailGuardado && this.palavraPasse === passwordGuardada) {
        await this.mostrarAviso('Sessão iniciada com sucesso!', 'success');
        this.router.navigateByUrl('/tabs/tab1'); // Redireciona para a aplicação
      } else {
        // Bloqueia o acesso se não houver conta ou os dados estiverem errados
        await this.mostrarAviso('Conta não encontrada ou credenciais inválidas.', 'danger');
      }
    }
  }

  // Função auxiliar para apresentar as mensagens de aviso temporárias no ecrã
  async mostrarAviso(mensagem: string, cor: string) {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 2500,
      color: cor,
      position: 'bottom'
    });
    await toast.present();
  }
}