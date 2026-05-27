// Importações nucleares do Angular para a estruturação do módulo e execução no navegador
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

// Integração da framework Ionic e configuração da base de dados de armazenamento local
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

// Importação do componente raiz e do módulo principal de navegação da aplicação
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Importação das configurações de ambiente e dos serviços remotos do Firebase
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Decorador que define as dependências globais e a configuração de arranque do projeto
@NgModule({
  declarations: [AppComponent], // Regista o componente principal (raiz) da aplicação
  imports: [
    BrowserModule, // Prepara a aplicação para ser executada no ambiente do navegador
    IonicModule.forRoot(), // Inicializa os recursos e componentes visuais do Ionic
    AppRoutingModule, // Injeta as regras de navegação globais
    IonicStorageModule.forRoot() // Instancia o motor de armazenamento local de dados
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, // Aplica a gestão de cache de rotas própria do Ionic
    // Inicializa a ligação ao projeto Firebase utilizando as credenciais do ficheiro de ambiente
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    // Ativa e disponibiliza o acesso global à base de dados remota (Firestore)
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent], // Indica o componente que deve ser carregado no arranque inicial
})
// Classe exportada que atua como o módulo central e unificador de toda a aplicação
export class AppModule {}