// Importações nucleares do Angular para a inicialização e gestão de ambientes da aplicação
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Importação do módulo principal da aplicação e das configurações de ambiente
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Importação da função responsável por carregar e registar componentes nativos para a web (ex: câmara)
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Ativa o modo de otimização de desempenho do Angular caso a aplicação esteja num ambiente de produção
if (environment.production) {
  enableProdMode();
}

// Executa o arranque inicial da aplicação carregando o módulo raiz e captura eventuais erros
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// Inicializa os elementos PWA personalizados e regista-os na janela global do navegador
defineCustomElements(window);