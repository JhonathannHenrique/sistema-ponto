# 🚀 Sistema de Ponto Inteligente
Sistema completo de gestão de ponto eletrônico com captura de geolocalização GPS, dados técnicos do dispositivo, e painéis diferenciados para colaboradores e administradores. Desenvolvido com React e Tailwind CSS, oferece uma experiência moderna e intuitiva.

### ✨ Principais Funcionalidades

#### 👤 Painel do Colaborador
- **Registro de Ponto com GPS**: Captura automática de localização com precisão
- **Cooldown de 60s**: Prevenção de registros duplicados
- **Relógio em Tempo Real**: Interface minimalista com hora atualizada
- **Justificativas**: Envio de justificativas para atrasos/faltas com data/hora
- **Anexos**: Upload de atestados e documentos (max 500KB)
- **Histórico Pessoal**: Visualização de todos os registros próprios
- **Notificações Toast**: Feedback visual para todas as ações

#### 🔐 Painel Administrativo
- **Dashboard com KPIs**: Cards com métricas em tempo real
  - Total de registros
  - Registros com GPS validado
  - Registros manuais
  - Registros editados
- **Tabela Completa**: Visualização de todos os registros com filtros
- **Busca Avançada**: Pesquisa por nome ou usuário
- **Raio-X Detalhado**: Modal com informações técnicas completas:
  - Geolocalização (lat/long, precisão, velocidade)
  - Dados de rede (IP, ISP, cidade/estado)
  - Informações do dispositivo (marca, modelo, SO)
  - Status da bateria
  - Resolução de tela
  - User Agent completo
- **Edição de Registros**: Sistema de auditoria com histórico
- **Relatórios PDF**: Geração de relatórios para impressão
- **Links Diretos**: Abertura no Google Maps com um clique

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones
- **Geolocation API** - Captura de GPS
- **Battery API** - Status da bateria
- **LocalStorage** - Persistência de dados local

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Passo a Passo

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sistema-ponto-inteligente.git

# Entre no diretório
cd sistema-ponto-inteligente

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

O projeto estará disponível em `http://localhost:5173`

## 🔑 Credenciais de Acesso

### Administrador
- **Usuário:** `admin`
- **Senha:** `admin123`

### Colaborador
- **Usuário:** `jhonathan`
- **Senha:** `jhonathan123`

## 🎯 Como Usar

### Registrar Ponto (Colaborador)
1. Faça login com suas credenciais
2. Aguarde o GPS ser ativado
3. Clique no botão central roxo (ícone de impressão digital)
4. Aguarde 60 segundos antes do próximo registro

### Justificar Ausência
1. Clique no ícone de alerta (laranja) no canto inferior esquerdo
2. Preencha data, hora e motivo
3. Envie a justificativa

### Anexar Documento
1. Clique em "Enviar Atestado/Documento" (rodapé)
2. Adicione descrição e selecione o arquivo
3. Envie (máx 500KB)

### Visualizar Registros (Admin)
1. Acesse com credenciais de admin
2. Use a busca para filtrar colaboradores
3. Clique em "Ver Detalhes" para raio-x completo
4. Clique em "Ver no Mapa" para abrir localização

## 📊 Estrutura de Dados

Cada registro contém:

```javascript
{
  id: timestamp,
  usuario: "jhonathan",
  nome: "Jhonathan Henrique",
  timestamp: "2024-01-15T14:30:00.000Z",
  tipo: "normal" | "manual" | "anexo",
  status: "valido" | "pendente" | "editado",
  gps: {
    latitude: -26.3044,
    longitude: -48.8464,
    precisao: 15.5,
    velocidade: 0
  },
  dadosTecnicos: {
    userAgent: "...",
    plataforma: "Win32",
    navegador: "Netscape",
    dispositivoInfo: { marca, modelo, tipo },
    tela: { largura, altura, touchScreen },
    bateria: { nivel, carregando },
    rede: { ip, provedor, cidade, estado }
  }
}
```

## 🎨 Design System

### Paleta de Cores
- **Primário:** Purple (`#9333ea`)
- **Secundário:** Pink (`#ec4899`)
- **Sucesso:** Green (`#10b981`)
- **Aviso:** Orange (`#f59e0b`)
- **Erro:** Red (`#ef4444`)

### Componentes
- **Modal**: Componente reutilizável com backdrop blur
- **Toast**: Notificações animadas com ícones
- **Cards KPI**: Métricas com ícones e hover effects
- **Tabela**: Design moderno com hover states

## 🔒 Segurança e Privacidade

- ⚠️ **Aviso**: Este é um projeto de demonstração
- Credenciais hardcoded apenas para fins educacionais
- Para produção, implementar:
  - Autenticação JWT/OAuth
  - Backend com banco de dados
  - Criptografia de dados sensíveis
  - Rate limiting
  - Validação server-side

## 🌐 Compatibilidade

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Requer HTTPS para GPS em produção

## 📱 Responsividade

- Design mobile-first
- Breakpoints otimizados
- Interface adaptável de 320px a 4K
