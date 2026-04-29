# 📱 FindIt — Itens Perdidos FIAP

## Visão Geral

O **FindIt** é um aplicativo mobile desenvolvido com **React Native + Expo** que centraliza o registro e a busca de itens perdidos dentro do ambiente da FIAP.

A proposta é simples: conectar quem perdeu com quem encontrou, por meio de um fluxo rápido, organizado e com suporte a imagens.

---

## Problema

A ausência de um sistema estruturado para gerenciar itens perdidos no campus gera retrabalho, desorganização e baixa taxa de recuperação.

O FindIt resolve isso ao:

- Centralizar registros de itens perdidos e encontrados  
- Facilitar a identificação por meio de fotos  
- Organizar informações por usuário  
- Melhorar a rastreabilidade dos itens  

---

## Funcionalidades

- Registro de itens perdidos e encontrados  
- Upload e preview de imagens (galeria)  
- Sistema de autenticação (cadastro e login)  
- Persistência de sessão e dados com AsyncStorage  
- Histórico individual por usuário  
- Validação de formulários com feedback visual  
- Status automático dos itens  
- Navegação protegida por autenticação  
- Rotas dinâmicas baseadas no tipo de item (`lost` / `found`)  
- Animações de erro para melhoria de UX  

---

## Arquitetura e Técnicas

### Autenticação
- Implementada via **Context API**
- Persistência com **AsyncStorage**
- Controle de sessão e proteção de rotas

### Persistência de Dados
- Armazenamento local com **AsyncStorage**
- Isolamento de dados por usuário (`userId`)

### Upload de Imagens
- Uso do `expo-image-picker`
- Armazenamento de URI local
- Exibição em preview nos formulários

### Navegação
- **Expo Router** com rotas baseadas em arquivos
- Rotas dinâmicas (`[type].js`) para reutilização de tela

### Experiência do Usuário
- Feedback visual com `Animated` (erro em formulários)
- Alertas de sucesso com `Alert`
- Interface com identidade FIAP (tema escuro + magenta)
- Tipografia com **Montserrat**

---
# Telas

### Login
<img src="https://github.com/user-attachments/assets/b958ae60-52cf-46b9-bb20-4430149620b5" width="300" />

### Cadastro
<img src="https://github.com/user-attachments/assets/179df81f-1f6c-4927-b37d-05163c3527db" width="300" />

### Tela Principal
<img src="https://github.com/user-attachments/assets/e4ddbb58-5223-4ac6-a442-fef661e18216" width="300" />

### Formulário
<img src="https://github.com/user-attachments/assets/651b8bef-47b3-434f-926e-ed2d8bbeb58e" width="300" />

### Mensagem de envio
<img src="https://github.com/user-attachments/assets/c35dd39e-7415-4b57-ad7f-66649d2adfb2" width="300" />

### Histórico
<img src="https://github.com/user-attachments/assets/a4eb78a0-bf69-4bd5-af83-e6f428f95307" width="300" />

### Perfil
<img src="https://github.com/user-attachments/assets/c29272e2-7042-42e1-b13d-4f61fa700e85" width="300" />

---

## Fluxo
[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://youtu.be/jJ2MBtiBfBY)

---

## Estrutura do Projeto
```
FindIt
├── app/
│   ├── auth/
│   │   ├── login.js
│   │   └── signin.js
│   │
│   ├── tabs/
│   │   ├── item/
│   │   │   └── [type].js
│   │   │
│   │   ├── success/
│   │   │   └── [type].js
│   │   │
│   │   ├── _layout.js
│   │   ├── history.js
│   │   ├── index.js
│   │   └── profile.js
│   │
│   ├── _layout.js
│   └── index.js
│
├── assets/
│   ├── android-icon-background.png
│   ├── android-icon-foreground.png
│   ├── android-icon-monochrome.png
│   ├── favicon.png
│   ├── icon.png
│   ├── logo-fiap.png
│   └── splash-icon.png
│
├── context/
│   ├── authContext.js
│   └── reportContext.js
│
├── util/
│   └── dateFormat.js
│
└── node_modules/
```

---

## Como Executar

### Pré-requisitos

- Node.js  
- npm ou yarn  
- Expo CLI  
- Expo Go ou emulador  

### Instalação

```bash
git clone https://github.com/AnaTorresLoureiro/fiap-mdi-cp1-ItensPerdidos-app.git
cd fiap-mdi-cp1-ItensPerdidos-app
npm install
npx expo start
```
Depois, escaneie o QR Code com o Expo Go ou execute em um emulador.

---

### Roadmap
- Integração com backend/API
- Sistema de busca e filtros avançados
- Notificações para correspondência de itens
- Melhorias de performance e caching
- Possível uso de armazenamento em nuvem para imagens

---

#### Integrantes

| Foto | Nome | RM |
|------|------|----|
| <img src="https://avatars.githubusercontent.com/AnaTorresLoureiro" width="80" style="border-radius:50%;"> | [Ana Laura Torres Loureiro](https://github.com/AnaTorresLoureiro) | RM 554375 |
| <img src="https://avatars.githubusercontent.com/MuriloCngp" width="80" style="border-radius:50%;"> | [Murilo Cordeiro Ferreira](https://github.com/MuriloCngp) | RM 556727 |
| <img src="https://avatars.githubusercontent.com/Geronimo-augusto" width="80" style="border-radius:50%;"> | [Geronimo Augusto Nascimento Santos](https://github.com/Geronimo-augusto) | RM 557170 |
| <img src="https://avatars.githubusercontent.com/iannyrfs" width="80" style="border-radius:50%;"> | [Ianny Raquel Ferreira De Souza](https://github.com/iannyrfs) | RM 559096 |
