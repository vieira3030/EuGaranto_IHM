import { Component } from '@angular/core';
// 1. Importar a função de registo e os ícones específicos
import { addIcons } from 'ionicons';
import { shieldCheckmark, people, person } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false
})
export class TabsPage {
  constructor() {
    // 2. Registar os ícones para serem reconhecidos no HTML
    addIcons({ shieldCheckmark, people, person });
  }
}