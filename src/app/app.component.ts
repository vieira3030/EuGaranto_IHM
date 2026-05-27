// Importação do módulo central do Angular para a definição de componentes
import { Component } from '@angular/core';

// Importação do plugin nativo do Capacitor para controlar a orientação do dispositivo
import { ScreenOrientation } from '@capacitor/screen-orientation';

// Importação do serviço que verifica o estado e o ambiente da plataforma de execução
import { Platform } from '@ionic/angular';

// Decorador que configura o componente principal (raiz) que encapsula toda a aplicação
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  
  // Construtor: inicializa a deteção da plataforma e aciona a rotina de arranque
  constructor(private platform: Platform) {
    this.iniciarApp();
  }

  // Executa as configurações globais logo após o carregamento inicial da aplicação
  async iniciarApp() {
    // Aguarda até que os recursos nativos do sistema operativo estejam prontos a usar
    await this.platform.ready();
    
    try {
      // Bloqueia fisicamente a orientação do ecrã em modo vertical (retrato)
      await ScreenOrientation.lock({ orientation: 'portrait' });
      console.log('Sucesso: Rotação de ecrã bloqueada via Capacitor.');
    } catch (error) {
      // Interceta o erro previsível que ocorre durante os testes no navegador do computador
      console.log('Aviso: O bloqueio de ecrã só funciona no telemóvel.', error);
    }
  }
}