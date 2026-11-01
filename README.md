# 🌿 Circuito Terê Verde

**MVP Mobile — Aplicativo de Ecoturismo e Turismo de Natureza em Teresópolis/RJ**

## 📌 Sobre o Projeto

O **Circuito Terê Verde** é um Produto Mínimo Viável (MVP) desenvolvido como trabalho acadêmico, com o objetivo de criar uma solução mobile para centralizar informações sobre trilhas, destinos naturais, atrativos ambientais e eventos relacionados ao turismo em Teresópolis, na região serrana do Rio de Janeiro.

O aplicativo busca facilitar o acesso a informações turísticas, incentivar o ecoturismo e proporcionar uma experiência simples e intuitiva para moradores e visitantes interessados em conhecer as belezas naturais da região.

## 🎯 Objetivo do Produto

Desenvolver um aplicativo mobile que permita aos usuários explorar destinos naturais de Teresópolis, consultar informações sobre trilhas e atrativos, acompanhar eventos e organizar seus locais de interesse por meio de uma lista de favoritos.

O projeto também conta com uma área administrativa destinada ao gerenciamento de conteúdos, permitindo demonstrar, no MVP, a integração entre interface mobile, autenticação e banco de dados em nuvem.

## 👥 Público-alvo

- Turistas interessados em ecoturismo e turismo de aventura.
- Moradores de Teresópolis e região.
- Pessoas interessadas em trilhas, montanhas e atividades ao ar livre.
- Visitantes que desejam conhecer os atrativos naturais da Serra dos Órgãos.

## 🌱 Benefícios para o Usuário

- **Informação centralizada:** acesso a informações sobre trilhas, destinos naturais e eventos em um único aplicativo.
- **Praticidade:** navegação simples entre as principais áreas do aplicativo.
- **Personalização:** possibilidade de editar informações do perfil e escolher uma foto.
- **Organização:** recurso de favoritos para guardar trilhas, atrativos e eventos de interesse.
- **Experiência mobile:** interface desenvolvida para dispositivos móveis, com navegação intuitiva.

## 🧩 Funcionalidades do MVP

### 1. Exploração de destinos e trilhas

- Catálogo de trilhas e destinos naturais de Teresópolis.
- Apresentação de informações e características dos locais.
- Páginas individuais com detalhes dos principais destinos, como Pedra do Sino, Pedra do Açu e Escalavrado.
- Informações sobre dificuldade, duração e descrição das trilhas, conforme os dados cadastrados.

### 2. Natureza e atrativos ambientais

- Área dedicada à apresentação de atrativos naturais.
- Conteúdos informativos relacionados à natureza e à conservação ambiental.
- Orientações para incentivar práticas responsáveis durante as visitas.

### 3. Eventos

- Página dedicada à divulgação de eventos.
- Exibição de informações sobre atividades e experiências na região.
- Área administrativa para gerenciamento dos dados dos eventos.

### 4. Cadastro e autenticação de usuários

- Cadastro de novas contas.
- Login com Firebase Authentication.
- Controle de sessão do usuário.
- Separação de permissões entre usuários comuns e administradores.

### 5. Perfil do usuário

- Exibição das informações da conta.
- Edição do nome do usuário.
- Seleção e alteração da foto de perfil.
- Encerramento da sessão.

**Armazenamento da foto:** a imagem escolhida é armazenada localmente no dispositivo. Portanto, ela não é sincronizada entre diferentes dispositivos e pode ser perdida caso o aplicativo seja desinstalado ou seus dados sejam apagados.

### 6. Sistema de favoritos

- Salvar trilhas, atrativos naturais e eventos.
- Remover itens da lista de favoritos.
- Consultar os itens salvos em uma área específica do aplicativo.
- Sincronização dos favoritos por meio do Firebase Firestore.

### 7. Área administrativa

Área destinada aos usuários com permissão de administrador, com funcionalidades para gerenciamento de conteúdos:

- Gerenciamento de trilhas e destinos.
- Gerenciamento de informações da página Natureza.
- Gerenciamento de eventos.
- Controle de acesso conforme o perfil do usuário.

> Algumas integrações entre os conteúdos administrados e as respectivas páginas públicas ainda estão em desenvolvimento.

## 🛠️ Tecnologias Utilizadas

### Frontend e desenvolvimento mobile

- **React Native:** desenvolvimento da interface mobile.
- **Expo:** ambiente e ferramentas para desenvolvimento e execução do aplicativo.
- **TypeScript:** tipagem e organização do código.
- **Expo Router:** navegação e gerenciamento de rotas.
- **JavaScript:** lógica de funcionamento da aplicação.

### Backend e serviços em nuvem

- **Firebase Authentication:** cadastro e autenticação de usuários.
- **Firebase Firestore:** armazenamento e sincronização de dados, incluindo perfis, favoritos e conteúdos administráveis.
- **Firebase Security Rules:** definição de permissões de leitura e escrita no banco de dados.

### Recursos e bibliotecas adicionais

- **Expo Image Picker:** seleção de imagens da galeria do dispositivo.
- **Expo File System:** armazenamento local da foto de perfil.
- **@expo/vector-icons:** biblioteca de ícones utilizada na interface.
- **React Native Safe Area Context:** adaptação da interface às áreas seguras do dispositivo.

## 🗄️ Estrutura de Dados

O projeto utiliza o Firebase Firestore como banco de dados em nuvem.

Entre as coleções e documentos utilizados estão:

- `users`: informações dos usuários, permissões e favoritos.
- `events`: informações dos eventos.
- `natureza`: conteúdo da página Natureza.
- `trails`: dados utilizados no gerenciamento administrativo de trilhas.

As fotos de perfil não são armazenadas no Firestore: permanecem no armazenamento local do dispositivo.

## 🚫 Fora do Escopo do MVP

Por se tratar de uma versão inicial e acadêmica, o projeto não contempla, neste momento:

- Rastreamento por GPS durante as trilhas.
- Navegação por mapas em tempo real.
- Monitoramento de condições climáticas.
- Sistema de avaliações e comentários públicos.
- Chat ou comunicação entre usuários.
- Reserva ou compra de ingressos e serviços turísticos.
- Integração automática com sistemas de órgãos oficiais de turismo.
- Notificações push e alertas em tempo real.

Essas funcionalidades poderão ser consideradas em versões futuras, conforme a evolução do projeto.

## ▶️ Como Executar o Projeto

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Expo Go ou ambiente de emulação Android/iOS.
- Acesso à configuração do projeto Firebase.

### Instalação

Clone o repositório:

```bash
git clone https://github.com/gabrielz072/MVPMobile.git
```

Entre na pasta do projeto:

```bash
cd MVPMobile
```

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npx expo start
```

Para executar no celular, utilize o aplicativo Expo Go e escaneie o QR Code apresentado no terminal ou no navegador.

> É necessário que a configuração do Firebase esteja disponível para que os recursos de autenticação e banco de dados funcionem corretamente.

## 👨‍💻 Desenvolvimento Acadêmico

Projeto desenvolvido por:

- Camilly Carreiro
- Caio Zambonelli
- Gabriel Santos

**Projeto acadêmico — MVP Mobile**

**Circuito Terê Verde 🌿**

Teresópolis — Rio de Janeiro, Brasil.