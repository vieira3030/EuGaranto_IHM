import { Component } from '@angular/core';
import { ScreenOrientation } from '@capacitor/screen-orientation'; // Importar o plugin

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  constructor() {
    this.lockOrientation();
  }

  async lockOrientation() {
    // Bloqueia a orientação em modo vertical (retrato)
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch (err) {
      console.log('Orientação não bloqueada no browser (apenas funciona em dispositivo físico)');
    }
  }
}