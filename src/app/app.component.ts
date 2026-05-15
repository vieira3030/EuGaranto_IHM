import { Component } from '@angular/core';
// 1. Importar o plugin do Capacitor
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.iniciarApp();
  }

  /** Inicializa a app e bloqueia a rotação */
  async iniciarApp() {
    await this.platform.ready();
    
    // 2. Tentar bloquear o ecrã apenas no modo vertical (portrait)
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
      console.log('Sucesso: Rotação de ecrã bloqueada via Capacitor.');
    } catch (error) {
      // Ignora o erro se estiveres a testar no computador (browser), 
      
      console.log('Aviso: O bloqueio de ecrã só funciona no telemóvel.', error);
    }
  }
}