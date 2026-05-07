import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GarantiasService } from '../../services/garantias';
import { GruposService } from '../../services/grupos';

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
    alertasMembros: {} as any
  };

  constructor(
    private garantiasService: GarantiasService,
    private gruposService: GruposService,
    private router: Router
  ) {
    addIcons({ closeCircle });
  }

  async ngOnInit() {
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
      this.novoGrupo.alertasMembros[this.novoMembroEmail] = '1 semana antes';
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

  async concluirCriacao() {
    // Guarda o grupo no Storage antes de navegar
    await this.gruposService.adicionarGrupo(this.novoGrupo);
    this.router.navigate(['/tabs/tab2']);
  }
}