Especificações Completas do Projeto KingRoad - Sistema de Alertas
1. Visão Geral do Projeto
1.1 O Ecossistema King

KingRoad: Aplicativo de navegação GPS especializado para caminhões e veículos profissionais
Família King: Ecossistema integrado com 4 aplicativos:

KingRoad (Navegação GPS para caminhoneiros)
KingChat (Mensagens instantâneas e chamadas)
KingLoc (Compartilhamento de localização e rastreamento)
King SMS (SMS avançado com voz-texto e comandos de voz)



1.2 Arquitetura Geral

Multi-plataforma: Android (Kotlin), iOS (KMM), Windows (Kotlin/JVM)
Backend: Implementado em Kotlin/Kotlin Multiplatform
Frontend: Implementado em React/JavaScript com Tailwind CSS
Persistência: SQLite para dados offline, Room como ORM
APIs: OpenStreetMap e interfaces proprietárias para tráfego
Tema principal: Dark theme (preto com detalhes dourados)

2. Estrutura do Projeto
2.1 Estrutura de Pastas Backend (Kotlin/KMM)
Copyapp/src/main/kotlin/com/kingroad/
  /native/      - Módulos e pacotes nativos para React Native
  /database/    - Entidades, DAOs e configurações de banco de dados
  /services/    - Serviços Android
  /receivers/   - BroadcastReceivers
  /cache/       - Gerenciamento de cache
  /utils/       - Utilidades gerais
2.2 Estrutura de Pastas Frontend (React/JavaScript)
Copyweb/src/
  /components/  - Componentes React
  /assets/      - Recursos visuais
  /utils/       - Utilidades JavaScript
  /hooks/       - Custom hooks React
3. Sistema de Alertas de Segurança - Estado Atual
3.1 Componentes Frontend Existentes (React/JavaScript)

SecurityAlertsMap.jsx - Visualização no mapa dos alertas, com filtros por tipo
AddSecurityAlert.jsx - Formulário para criação de alertas
RealTimeDetectionAlert.jsx - Notificações em tempo real com som AMBER Alert
EmergencyAlertWithLocation.jsx - Integração com KingLoc para localização em tempo real
BrakeFailureAlert.jsx - Alerta lateral para caminhões sem freio em descidas
EscapeAreasSidebar.jsx - Barra lateral com áreas de escape para emergências

3.2 Componentes Backend Existentes (Kotlin)

SecurityAlert.kt - Entidade principal para alertas no banco de dados Room
SecurityAlertService.kt - Serviço para processamento de alertas em tempo real
SecurityAlertBridge.kt - Bridge para comunicação entre o React e código nativo Kotlin

3.3 Funcionalidades Já Implementadas

Sistema de Alertas de Segurança Europeu:

Roubo de cargas (cargo_theft)
Corte de lonas em caminhões tipo sider/curtain (curtain_cutting)
Ataques com gás sonífero (gas_attack)


Sistema de Alertas de Caminhões sem Freio:

Alertas direcionais (2km para trás e até o fim da descida no mesmo sentido)
Visualização de áreas de escape com tempo estimado
Navegação direta para áreas de escape


Notificação AMBER Alert/Emergency Alert System:

Som específico em app/src/main/res/raw/emergency_alert_system.mp3
Vibração com padrão específico (500ms on, 500ms off, 500ms on, 1500ms off)
Cores e design visual baseados no EAS (fundo âmbar com texto preto)



4. Requisitos para o Novo Sistema de Alertas Brasil
4.1 Categorias de Alertas a Implementar

Tiroteio - Áreas com conflitos armados em andamento
Sequestro - Alertas de tentativas de sequestro ou arrastão
Roubo de Carga - Versão brasileira do alerta já implementado
Veículo Suspeito - Identificação de veículos potencialmente envolvidos em crimes
Veículo em Alta Velocidade - Alerta para veículos trafegando 80% acima do limite ou realizando manobras perigosas

4.2 Requisitos Técnicos

Manter compatibilidade com a arquitetura existente
Usar o mesmo estilo de notificação (AMBER Alert)
Integrar com a família de aplicativos King, especialmente o KingLoc
Seguir padrões estabelecidos para verificação de propriedades indefinidas e tratamento de erros
Manter design visual consistente com o tema do KingRoad (escuro com detalhes dourados)

5. Padrões de Desenvolvimento
5.1 Diretrizes de Nomenclatura

O nome do projeto deve ser tratado exclusivamente como KingRoad, sem espaços
Usar PascalCase para nomes de componentes (ex: FoodTruckPOI.jsx)
Usar kebab-case para IDs de artefatos (ex: food-truck-poi)

5.2 Diretrizes para Criação de Componentes React

Para cada novo arquivo, informar:

Nome completo do arquivo com extensão (ex: PowerButton.jsx)
Formato/linguagem do arquivo (ex: JavaScript, Kotlin, XML)
Caminho completo para salvar (ex: web/src/components/)


Estrutura completa do componente:

Incluir todos os imports necessários
Implementar o componente completo
Incluir export default
NÃO truncar ou abreviar o código com comentários como "// resto do código aqui"


Modo Preview:

Priorizar abordagens que possam ser visualizadas através do modo Preview
Usar o console para depurar e verificar o funcionamento do código
Mostrar alternativas visuais quando relevante
Indicar claramente os estados interativos (hover, active, focus)



5.3 Padrões Arquiteturais

MVVM (Model-View-ViewModel) para a arquitetura geral
Repository Pattern para acesso a dados
Service Locator para gerenciamento de dependências
Observer Pattern para notificações e atualizações em tempo real

6. Módulos do Sistema KingRoad Relevantes para o Projeto
6.1 Sistema de Segurança

SecurityAlertSystem.kt: Gerencia alertas de segurança para motoristas
ExclusionZoneSystem.kt: Define e gerencia zonas de alto risco
SafeReroutingSystem.kt: Recalcula rotas de forma segura quando ocorrem desvios
SecurityAlertInterface.jsx: Interface para alertas de segurança

6.2 Sistemas de Comunicação e Rastreamento

SocialCommunicationSystem.kt: Implementa comunicação entre motoristas
MessageManager: Gerencia o envio e recebimento de mensagens
TrackingManager: Coordena o compartilhamento de localização entre motoristas

6.3 Integrações Relevantes

KingIntegrationSystem.kt: Gerencia a integração entre serviços da família King
KingMessengerManager: Integração com o serviço de mensagens
KingLocManager: Integração com o serviço de localização em tempo real
KingSMSManager: Integração com o serviço de SMS com suporte a conversão de voz

7. Tecnologias e Ferramentas
7.1 Backend

Kotlin como linguagem principal
KMM (Kotlin Multiplatform Mobile) para compartilhamento de código
Room para persistência de dados local
Coroutines para operações assíncronas

7.2 Frontend

React como framework principal
Tailwind CSS para estilização
Lucide-React para ícones
React-Leaflet para mapas interativos
