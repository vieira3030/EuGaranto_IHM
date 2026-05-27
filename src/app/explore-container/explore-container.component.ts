import { Component, Input } from '@angular/core';

// Componente responsável por renderizar o contentor genérico de exploração na interface
@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent {
  
  // Propriedade de entrada que recebe o nome ou título a ser exibido no componente
  @Input() name?: string;
  
}