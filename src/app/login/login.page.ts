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
  // Define o estado do ecrã: true para Login, false para Registo
  modoLogin: boolean = true; 
  
  // Variáveis para armazenar os dados introduzidos pelo utilizador
  nome: string = '';
  email: string = '';
  palavraPasse: string = '';

  constructor(private router: Router, private toastCtrl: ToastController) {}

  // Alterna a interface entre Login e Registo e limpa os dados
  alternarModo() {
    this.modoLogin = !this.modoLogin;
    this.nome = '';
    this.email = '';
    this.palavraPasse = '';
  }

  // Processa a tentativa de entrada ou criação de conta
  async submeter() {
    // Valida se os campos obrigatórios estão devidamente preenchidos
    if (!this.email || !this.palavraPasse || (!this.modoLogin && !this.nome)) {
      this.mostrarAviso('Por favor, preenche todos os campos necessários.', 'danger');
      return;
    }

    if (!this.modoLogin) {
      // --- FLUXO DE REGISTO ---
      // Grava o Nome, Email e Palavra-passe na memória local do navegador
      localStorage.setItem('mockEmail', this.email);
      localStorage.setItem('mockPassword', this.palavraPasse);
      localStorage.setItem('mockNome', this.nome);
      
      // SOLUÇÃO: Limpa a fotografia da conta anterior sempre que uma nova conta é criada!
      localStorage.removeItem('mockFoto');
      
      await this.mostrarAviso('Conta criada com sucesso! Já podes iniciar sessão.', 'success');
      this.alternarModo(); // Muda automaticamente para o ecrã de entrada
      
    } else {
      // --- FLUXO DE LOGIN ---
      // Recupera as credenciais guardadas na memória local
      const emailGuardado = localStorage.getItem('mockEmail');
      const passwordGuardada = localStorage.getItem('mockPassword');

      // Verifica se os dados coincidem com o registo
      if (this.email === emailGuardado && this.palavraPasse === passwordGuardada) {
        // Cria a chave de sessão ativa para permitir a navegação livre
        localStorage.setItem('session_active', 'true'); 
        await this.mostrarAviso('Sessão iniciada com sucesso!', 'success');
        this.router.navigateByUrl('/tabs/tab1'); // Avança para as garantias
      } else {
        // Bloqueia a entrada se os dados estiverem incorretos
        await this.mostrarAviso('Conta não encontrada ou credenciais inválidas.', 'danger');
      }
    }
  }

  // Função auxiliar para exibir notificações temporárias no ecrã
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