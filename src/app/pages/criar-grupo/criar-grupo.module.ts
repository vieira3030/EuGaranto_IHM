// Importações dos módulos nucleares do Angular e do Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Importações do sistema de rotas e do componente principal da página
import { CriarGrupoPageRoutingModule } from './criar-grupo-routing.module';
import { CriarGrupoPage } from './criar-grupo.page';

// Decorador que define este ficheiro como um módulo Angular e configura as dependências necessárias
@NgModule({
  imports: [
    CommonModule, // Fornece as diretivas estruturais base do Angular (ex: *ngIf, *ngFor)
    FormsModule, // Permite a ligação bidirecional de dados entre o HTML e o TS nos formulários (ngModel)
    IonicModule, // Ativa a utilização das tags e componentes visuais nativos do Ionic
    CriarGrupoPageRoutingModule // Configura o sistema de navegação específico para aceder a esta página
  ],
  declarations: [CriarGrupoPage] // Declara e regista o componente principal para que a interface o reconheça
})
// Classe exportada que encapsula a página de criação de grupos e os seus recursos
export class CriarGrupoPageModule {}