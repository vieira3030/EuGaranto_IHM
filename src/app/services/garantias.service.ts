import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Firestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { LocalNotifications } from '@capacitor/local-notifications'; 

// Interface que define a estrutura de dados de um grupo de partilha
export interface Grupo {
  id?: string;
  nome: string;
  adminEmail: string;
  membros: string[];
  garantiasIds: string[];
  alertaConfig: string;
}

// Serviço central para gestão de garantias e grupos, sincronizando armazenamento local e remoto
@Injectable({ providedIn: 'root' })
export class GarantiasService {
  
  // Referência para a instância ativa da base de dados local (Ionic Storage)
  private _storage: Storage | null = null;
  
  // Emissor de eventos para notificar a interface sobre atualizações nos dados
  public dadosAlterados = new EventEmitter<void>();

  // Inicializa os serviços de armazenamento local e remoto (Firestore)
  constructor(private storage: Storage, private firestore: Firestore) { 
    this.init(); 
  }

  // Instancia a base de dados local e aciona o carregamento inicial
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.carregarDadosIniciais();
  }

  // Importa dados de teste de um ficheiro JSON caso o armazenamento local esteja vazio
  private async carregarDadosIniciais() {
    const jaTemDados = await this._storage?.get('dados_app');
    if (!jaTemDados) {
      const res = await fetch('/assets/data/garantias.json');
      const dados = await res.json();
      await this._storage?.set('dados_app', dados);
    }
  }

  // Invoca o método interno responsável pela remoção de uma garantia
  async apagarGarantia(id: string) {
    return this.removerGarantia(id);
  }

  // Devolve a lista completa de garantias guardadas no armazenamento local
  async getGarantias() {
    const data = await this._storage?.get('dados_app');
    return data?.garantias || [];
  }

  // Regista uma nova garantia no Firebase (sem imagens) e na memória local, agendando o alerta
  async adicionarGarantia(novaGarantia: any) {
    try {
      const garantiaParaNuvem = { ...novaGarantia };
      garantiaParaNuvem.fotoTalao = '';
      garantiaParaNuvem.fotoLocal = '';

      const garantiasRef = collection(this.firestore, 'garantias');
      const docRef = await addDoc(garantiasRef, garantiaParaNuvem);
      
      novaGarantia.id = docRef.id; 
      console.log('Firebase: Criado com ID:', docRef.id);
    } catch (error) {
      console.error('Erro Firebase:', error);
    }

    let garantias = await this.getGarantias();
    garantias.push(novaGarantia);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit(); 
    }

    // Aciona o agendamento da notificação nativa para a nova garantia
    await this.agendarNotificacao(novaGarantia);
  }

  // Atualiza as propriedades de uma garantia na memória local e no Firebase
  async editarGarantia(garantiaEditada: any) {
    let garantias = await this.getGarantias();
    const index = garantias.findIndex((g: any) => g.id === garantiaEditada.id);

    if (index !== -1) {
      garantias[index] = garantiaEditada;
      const dadosAtuais = await this._storage?.get('dados_app');
      if (dadosAtuais) {
        dadosAtuais.garantias = garantias;
        await this._storage?.set('dados_app', dadosAtuais);
        this.dadosAlterados.emit();
      }
    }

    try {
      if (garantiaEditada.id && garantiaEditada.id.length > 15) {
        const garantiaRef = doc(this.firestore, 'garantias', garantiaEditada.id);
        const copiaNuvem = { ...garantiaEditada };
        copiaNuvem.fotoTalao = '';
        copiaNuvem.fotoLocal = '';
        
        await updateDoc(garantiaRef, copiaNuvem);
      }
    } catch (error) {
      console.error('Erro Firebase:', error);
    }
  }

  // Elimina permanentemente o registo de uma garantia do armazenamento local e da nuvem
  async removerGarantia(id: string) {
    let garantias = await this.getGarantias();
    garantias = garantias.filter((g: any) => g.id !== id);

    const dadosAtuais = await this._storage?.get('dados_app');
    if (dadosAtuais) {
      dadosAtuais.garantias = garantias;
      await this._storage?.set('dados_app', dadosAtuais);
      this.dadosAlterados.emit();
    }

    try {
      if (id && id.length > 15) {
        const docRef = doc(this.firestore, 'garantias', id);
        await deleteDoc(docRef);
      }
    } catch (e) {
      console.error('Erro Firebase:', e);
    }
  }

  // Regista um novo grupo de partilha na base de dados remota e emite evento de atualização
  async criarGrupo(novoGrupo: Grupo) {
    try {
      const gruposRef = collection(this.firestore, 'grupos');
      const docRef = await addDoc(gruposRef, novoGrupo);
      
      console.log('Firebase: Grupo criado com sucesso. ID:', docRef.id);
      this.dadosAlterados.emit();
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar grupo no Firebase:', error);
      return null;
    }
  }

  // Atualiza os dados de um grupo existente diretamente no Firebase
  async editarGrupo(grupoEditado: Grupo) {
    try {
      if (grupoEditado.id) {
        const grupoRef = doc(this.firestore, 'grupos', grupoEditado.id);
        const copiaNuvem = { ...grupoEditado };
        delete copiaNuvem.id; 
        
        await updateDoc(grupoRef, copiaNuvem);
        console.log('Firebase: Grupo updated.');
        this.dadosAlterados.emit();
      }
    } catch (error) {
      console.error('Erro Firebase ao editar grupo:', error);
    }
  }

  // Obtém do Firebase a lista de grupos onde o endereço de email especificado consta como membro
  async getGruposRemotos(emailUtilizador: string) {
    try {
      const gruposRef = collection(this.firestore, 'grupos');
      const q = query(gruposRef, where('membros', 'array-contains', emailUtilizador));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Grupo[];
    } catch (error) {
      return [];
    }
  }

  // Lê os dados do perfil de utilizador a partir do ficheiro JSON local
  async getPerfil() {
    try {
      const res = await fetch('/assets/data/perfil.json');
      const dados = await res.json();
      return dados.utilizador;
    } catch (error) {
      return null;
    }
  }

  // Arquiva o registo de um grupo no histórico local para consulta futura
  async guardarGrupoAntigo(grupo: any) {
    const historico = await this.storage.get('gruposAntigos') || [];
    
    if (!historico.find((g: any) => g.id === grupo.id)) {
      historico.push(grupo);
      await this.storage.set('gruposAntigos', historico);
    }
  }

  // Devolve a lista de grupos arquivados no armazenamento local
  async getGruposAntigos() {
    return await this.storage.get('gruposAntigos') || [];
  }

  // Pede permissão ao sistema operativo e agenda um alerta local para a expiração
  async agendarNotificacao(garantia: any) {
    const permissao = await LocalNotifications.requestPermissions();
    
    if (permissao.display === 'granted') {
      const dataAviso = new Date(Date.now() + 1000 * 30); 

      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 100000), 
            title: 'Garantia a Expirar! ⏳',
            body: `A garantia do teu produto "${garantia.nome || garantia.nomeProduto}" está quase a terminar.`,
            schedule: { at: dataAviso }, 
            sound: undefined, 
          }
        ]
      });

      console.log('Notificação agendada com sucesso para:', dataAviso);
    } else {
      console.log('O utilizador não deu permissão para notificações.');
    }
  }
}