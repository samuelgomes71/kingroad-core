# 🛣️ KingRoad

**KingRoad** é um aplicativo multiplataforma de navegação e assistência inteligente para caminhoneiros e motoristas de veículos pesados. Criado com foco em segurança, eficiência e personalização, ele integra ferramentas de navegação avançadas, atualização em tempo real de POIs, modos de trilha e suporte ao escaneamento de documentos (via KingScan Lite).

## 📱 Plataformas Suportadas

- 📱 **Mobile:** React Native (iOS & Android)
- 🌐 **Web:** React + Tailwind CSS
- ⚙️ **Core:** Kotlin Multiplatform
- 🔙 **Backend:** Node.js com PostgreSQL + Firebase
- ☁️ **Infra:** AWS, Google Cloud, Azure (multi-cloud)

## 🚛 Funcionalidades Principais

- Navegação adaptada para caminhões (restrições de altura, peso e carga)
- Atualização em tempo real de POIs (postos, mecânicas, áreas de descanso)
- Modo offline com cache de mapas
- Feedback e avaliação de locais por motoristas
- Alertas inteligentes de segurança em rota
- Visualização por satélite com sobreposição de rotas
- Gravação de trilhas (hike, bike, moto, 4x4, snowmobile)
- Perfis de veículos customizáveis
- Preferências de rota: evitar pedágios, escolher tipo de via
- Integração com KingScan Lite para escaneamento de documentos (modo caminhões)
- Suporte completo a motos (modo urbano, rodoviário, off-road)
- Tela inicial personalizável
- Assistente de voz com linguagem PX de caminhoneiro (QRA, 10-4, etc.)

## 🧱 Estrutura do Projeto

- `navigation-core/` → Motor de navegação e roteamento
- `poi-engine/` → Sistema de pontos de interesse
- `offline-support/` → Gerenciamento de mapas offline
- `trail-tracker/` → Módulo de trilhas e gravação de percurso
- `user-feedback/` → Sistema de avaliações e comentários
- `vehicle-profiles/` → Configurações por tipo de veículo
- `kingscan-lite/` → Integração com scanner de documentos simples
- `satellite-layer/` → Visualização com imagens de satélite
- `mascot-engine/` → Gerenciamento do mascote Tio Sam
- `home-screen/` → Customização da tela inicial

## 🎨 Identidade Visual

- Paleta: preto fosco, bronze, dourado e bege
- Mascote: **Tio Sam**, com variações regionais
- Estilo de linguagem: comunicação de rádio PX (CB) com uso de QRA

## 🧠 IA e Inteligência Embarcada

- Sugestões automáticas de rota com base no histórico e segurança
- Alertas preditivos baseados em segmentação de risco
- Assistente de voz com vocabulário de caminhoneiros

## 📂 Organização dos Dados

- **Mapas:** cache local e sincronização com nuvem
- **POIs:** base atualizável em tempo real
- **Documentos:** armazenamento temporário local via KingScan Lite

## 🧪 Tecnologias e Dependências

- Kotlin Multiplatform
- React Native & React.js
- Node.js + PostgreSQL
- Firebase Auth e Sync
- Mapbox SDK ou similar
- OCR básico para scanner
- Tailwind CSS
- Docker, CI/CD (DevOps)

## 📌 Observações

- Este repositório usa apenas a pasta `poi/` (substituindo a antiga `POIS/`)
- O app será lançado inicialmente como beta gratuito por 6 meses, com aviso de monetização de 30 dias
- Código modular e preparado para expansão com novos modos e veículos

---

> Projeto criado por Samuel como parte do ecossistema **Família King**.

