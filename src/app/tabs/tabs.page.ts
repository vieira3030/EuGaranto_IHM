// Importação do módulo central do Angular para a definição de componentes
import { Component } from '@angular/core';

// Importação da função de registo de ícones visuais nativos da biblioteca Ionic
import { addIcons } from 'ionicons';

// Importação dos ícones específicos utilizados no menu de navegação
import { shieldCheckmark, people, person } from 'ionicons/icons';

// Decorador que define o seletor, a estrutura HTML e os estilos associados aos separadores
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false
})
// Classe responsável por encapsular a lógica do contentor principal de navegação (Tabs)
export class TabsPage {
  
  // Construtor: inicializa a classe e regista os ícones visuais para utilização na interface HTML
  constructor() {
    addIcons({ shieldCheckmark, people, person });
  }
}