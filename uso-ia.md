# Declaração de Uso de Inteligência Artificial (IA)
**Unidade Curricular:** Interação Homem-Máquina (IHM)
**Projeto:** EuGaranto - Aplicação de Gestão de Garantias
**Grupo:** Grupo 05

Este ficheiro detalha as contribuições do trabalho autónomo realizado pelos membros do grupo e o apoio técnico obtido através do uso de ferramentas de Inteligência Artificial Generativa (Gemini) durante o desenvolvimento do protótipo funcional.

---

## 1. Trabalho Autónomo (Desenvolvimento do Grupo)
As decisões de arquitetura de software, engenharia de requisitos, design visual e a lógica base do ecossistema foram concebidas e executadas autonomamente pelo grupo:

* **Arquitetura e Modulação:** Estruturação inicial do projeto Ionic/Angular, mapeamento de rotas nativas (`tabs`) e desenho de fluxos de navegação das páginas principais.
* **Modelação de Dados e Integração:** Desenho dos modelos estruturais para os objetos `Garantia`, `Grupo` e `Perfil`. Implementação dos serviços centrais para comunicação assíncrona remota (`GarantiasService` e `GruposService`).
* **Design de Interface (UI):** Criação das maquetes conceituais e definição do guia de estilo visual (paleta de cores, tipografia com pesos acentuados e cantos arredondados geométricos de 12px/16px).
* **Desenvolvimento de Controladores:** Escrita dos algoritmos de ciclo de vida das páginas (`ngOnInit`, `ionViewWillEnter`) e manipulação de arrays para filtragem de listas.
* **Integração de Hardware Nativo:** Configuração do Capacitor e chamadas nativas à câmara fotográfica do dispositivo telemóvel para captura de documentos.

---

## 2. Trabalho Assistido por Inteligência Artificial (IA)
A Inteligência Artificial foi utilizada como um assistente de desenvolvimento (*co-pilot*) focado na otimização de código, resolução de erros do compilador (*troubleshooting*) e aceleração de refatorizações complexas:

* **Resolução de Erros e Bugs de Renderização:**
  * Apoio na identificação e correção do erro de ambiente web do Capacitor Camera através da configuração global de bibliotecas PWA Elements no ficheiro `main.ts`.
  * Resolução de falhas de renderização no DOM do `<ion-footer>`, sugerindo a substituição de componentes estruturais por grelhas nativas flexíveis (`<ion-row>` e `<ion-col>`).
* **Refatorização de Código para Persistência Avançada:**
  * Auxílio na migração do motor síncrono `localStorage` para a API assíncrona do `@ionic/storage-angular` (IndexedDB) no serviço centralizado, adaptando os controladores para resolver as novas *promises*.
* **Otimização de CSS / Estilização Soft UI:**
  * Geração de propriedades CSS modernas (como pseudo-classes `&:focus-within` e transições de bordas dinâmicas) para criar caixas estruturais envolventes para os inputs da aplicação.
* **Lógica Reativa de Usabilidade (UX):**
  * Apoio no desenvolvimento de expressões booleanas e operadores ternários inseridos no HTML para dinamizar o painel superior (`summary-banner`) e ocultar ou exibir botões de ação e rodapés de forma condicional conforme o estado de arquivo/expiração.

---

## 3. Considerações Éticas e Críticas
Toda a lógica gerada ou sugerida por ferramentas de IA foi rigorosamente analisada, testada e adaptada manualmente pelos elementos do grupo. A IA funcionou exclusivamente como um utilitário para contornar limitações técnicas específicas e acelerar a estilização visual, garantindo que a autoria intelectual e a execução final do projeto pertencem integralmente ao Grupo 05.