import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Firestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { LocalNotifications } from '@capacitor/local-notifications'; // Importação do plugin de notificações

// Estrutura de dados para representar um Grupo de partilha
export interface Grupo {
  id?: string;
  nome: string;
  adminEmail: string;
  membros: string[];
  garantiasIds: string[];
  alertaConfig: string;
}

@Injectable({ providedIn: 'root' })
export class GarantiasService {
  
  // Instância ativa do motor de base de dados local Ionic Storage
  private _storage: Storage | null = null;
  
  // Emissor de eventos para sinalizar mudanças nos dados e atualizar as páginas
  public dadosAlterados = new EventEmitter<void>();

  constructor(private storage: Storage, private firestore: Firestore) { 
    this.init(); 
  }

  // Inicializa o motor de armazenamento local Ionic Storage
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.carregarDadosIniciais();
  }

  // Carrega as garantias padrão do ficheiro JSON caso a memória local esteja vazia
  private async carregarDadosIniciais() {
    const jaTemDados = await this._storage?.get('dados_app');
    if (!jaTemDados) {
      const res = await fetch('/assets/data/garantias.json');
      const dados = await res.json();
      await this._storage?.set('dados_app', dados);
    }
  }

  // Encaminha o pedido de eliminação da página de detalhes para a lógica de remoção
  async apagarGarantia(id: string) {
    return this.removerGarantia(id);
  }

  // Obtém a lista completa de todas as garantias guardadas localmente
  async getGarantias() {
    const data = await this._storage?.get('dados_app');
    return data?.garantias || [];
  }

  // Regista uma nova garantia no armazenamento local, na Firebase e agenda o alerta
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

    // Agenda a notificação local para esta nova garantia
    await this.agendarNotificacao(novaGarantia);
  }

  // Atualiza os dados de uma garantia específica no local e no Firebase
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

  // Elimina de forma permanente uma garantia do Ionic Storage e da nuvem Firebase
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

  // Cria as credenciais e o registo de um novo grupo de partilha no Firebase
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

  // Guarda as alterações feitas nas propriedades de um grupo remoto no Firebase
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

  // Localiza e lista todos os grupos do Firebase onde o utilizador está registado
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

  // Importa a estrutura de dados inicial do perfil através de um ficheiro JSON local
  async getPerfil() {
    try {
      const res = await fetch('/assets/data/perfil.json');
      const dados = await res.json();
      return dados.utilizador;
    } catch (error) {
      return null;
    }
  }

  // Grava de forma assíncrona um grupo arquivado no histórico local do Ionic Storage
  async guardarGrupoAntigo(grupo: any) {
    const historico = await this.storage.get('gruposAntigos') || [];
    
    if (!historico.find((g: any) => g.id === grupo.id)) {
      historico.push(grupo);
      await this.storage.set('gruposAntigos', historico);
    }
  }

  // Devolve todos os registos de grupos antigos armazenados na memória local
  async getGruposAntigos() {
    return await this.storage.get('gruposAntigos') || [];
  }

  // Pede permissão ao telemóvel e agenda o aviso para aparecer no ecrã
  async agendarNotificacao(garantia: any) {
    const permissao = await LocalNotifications.requestPermissions();
    
    if (permissao.display === 'granted') {
      // Agendado para daqui a 1 minuto para efeitos de teste
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