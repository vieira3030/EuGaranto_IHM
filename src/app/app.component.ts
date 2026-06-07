// Importações nucleares do Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Componente raiz que envolve toda a aplicação
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  constructor(private router: Router) {
    // Valida a entrada do utilizador logo no arranque da aplicação
    this.verificarSessao();
  }

  // Verifica se existe uma sessão ativa válida na memória
  verificarSessao() {
    // Se a chave "session_active" não existir ou for falsa, expulsa para o login
    if (localStorage.getItem('session_active') !== 'true') {
      this.router.navigateByUrl('/login');
    }
  }
}