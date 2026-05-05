import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GarantiasService } from '../../services/garantias';

// Importações corretas para Standalone Components
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, 
  IonInput, IonButton, IonFooter, IonList, IonCheckbox, IonSelect, IonSelectOption, IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';

@Component({
  selector: 'app-criar-grupo',
  templateUrl: './criar-grupo.page.html',
  styleUrls: ['./criar-grupo.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonItem, IonLabel, IonInput, IonButton, IonFooter, IonList, IonCheckbox, IonSelect, IonSelectOption, IonIcon
  ]
})
export class CriarGrupoPage implements OnInit {
  passoAtual: number = 1;
  novoMembroEmail: string = '';
  garantiasDisponiveis: any[] = [];

  novoGrupo = {
    id: Date.now().toString(),
    nome: '',
    membros: [] as string[],
    garantiasPartilhadas: [] as any[],
    alertasMembros: {} as any // Guarda as preferências de alerta de cada membro
  };

  constructor(
    private garantiasService: GarantiasService,
    private router: Router
  ) {
    addIcons({ closeCircle });
  }

  async ngOnInit() {
    // Carrega as garantias do utilizador para ele poder escolher quais partilhar
    this.garantiasDisponiveis = await this.garantiasService.getGarantias();
  }

  avancarPasso() {
    if (this.passoAtual < 4) this.passoAtual++;
  }

  recuarPasso() {
    if (this.passoAtual > 1) this.passoAtual--;
  }

  adicionarMembro() {
    if (this.novoMembroEmail.trim() !== '' && !this.novoGrupo.membros.includes(this.novoMembroEmail)) {
      this.novoGrupo.membros.push(this.novoMembroEmail);
      this.novoGrupo.alertasMembros[this.novoMembroEmail] = '1 semana antes'; // Alerta por defeito
      this.novoMembroEmail = '';
    }
  }

  removerMembro(email: string) {
    this.novoGrupo.membros = this.novoGrupo.membros.filter(m => m !== email);
    delete this.novoGrupo.alertasMembros[email];
  }

  toggleGarantia(garantia: any) {
    const index = this.novoGrupo.garantiasPartilhadas.findIndex(g => g.id === garantia.id);
    if (index > -1) {
      this.novoGrupo.garantiasPartilhadas.splice(index, 1);
    } else {
      this.novoGrupo.garantiasPartilhadas.push(garantia);
    }
  }

  isGarantiaSelecionada(id: string): boolean {
    return this.novoGrupo.garantiasPartilhadas.some(g => g.id === id);
  }

  concluirCriacao() {
    // Aqui no futuro chamaremos o GruposService (Issue #9) para guardar o grupo.
    console.log('Grupo criado:', this.novoGrupo);
    this.router.navigate(['/tabs/tab2']); // Volta para a tab de Grupos
  }
}