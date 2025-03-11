# Real-Time Chat Application

A modern, feature-rich chat application built with React, Node.js, and MongoDB.

## Features

- 💬 Real-time messaging with WebSocket support
- 📞 Audio and video calls
- 🤝 Friend requests and management
- 📱 Responsive design for all devices
- 🌓 Light/Dark mode support
- 📎 File sharing capabilities
- 🎙️ Voice messages
- ⭐ Message favorites
- 📊 Read receipts
- 🔔 Real-time notifications

## Tech Stack

- **Frontend:**

  - React with TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Socket.IO client
  - Framer Motion for animations

- **Backend:**
  - Node.js with Express
  - MongoDB with Mongoose
  - Socket.IO for real-time communication
  - JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd chat-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
PORT=3000
```

4. Start the development server:

```bash
npm run dev
```

5. Start the backend server:

```bash
npm run server
```

The application will be available at `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── context/       # React context providers
│   ├── services/      # API services
│   ├── lib/           # Utility functions
│   └── hooks/         # Custom React hooks
├── server/
│   ├── controllers/   # Route controllers
│   ├── models/        # Mongoose models
│   ├── routes/        # Express routes
│   └── middleware/    # Express middleware
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Messages

- `POST /api/messages` - Send a message
- `GET /api/messages/:conversationId` - Get conversation messages
- `PUT /api/messages/:messageId/read` - Mark message as read
- `PUT /api/messages/:messageId/favorite` - Toggle message favorite

### Conversations

- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/unread` - Get unread message counts

### Calls

- `POST /api/calls` - Create a new call
- `PUT /api/calls/:callId` - Update call status
- `GET /api/calls/history` - Get call history

### Friends

- `POST /api/friends/request` - Send friend request
- `PUT /api/friends/request/:requestId` - Respond to friend request
- `GET /api/friends/requests` - Get pending friend requests

---

[🇫🇷 Version française](#application-de-chat-en-temps-réel)

# Application de Chat en Temps Réel

Une application de chat moderne et riche en fonctionnalités, construite avec React, Node.js et MongoDB.

## Fonctionnalités

- 💬 Messagerie en temps réel avec support WebSocket
- 📞 Appels audio et vidéo
- 🤝 Gestion des demandes d'amis
- 📱 Design responsive pour tous les appareils
- 🌓 Support des modes clair/sombre
- 📎 Partage de fichiers
- 🎙️ Messages vocaux
- ⭐ Messages favoris
- 📊 Accusés de lecture
- 🔔 Notifications en temps réel

## Stack Technique

- **Frontend :**

  - React avec TypeScript
  - Tailwind CSS
  - Composants shadcn/ui
  - Client Socket.IO
  - Framer Motion pour les animations

- **Backend :**
  - Node.js avec Express
  - MongoDB avec Mongoose
  - Socket.IO pour la communication en temps réel
  - JWT pour l'authentification

## Pour Commencer

### Prérequis

- Node.js (v18 ou supérieur)
- Base de données MongoDB
- Git

### Installation

1. Cloner le dépôt :

```bash
git clone <url-du-depot>
cd chat-app
```

2. Installer les dépendances :

```bash
npm install
```

3. Créer un fichier `.env` à la racine du projet :

```env
MONGODB_URI=votre_chaine_de_connexion_mongodb
JWT_SECRET=votre_secret_jwt
CLIENT_URL=http://localhost:5173
PORT=3000
```

4. Démarrer le serveur de développement :

```bash
npm run dev
```

5. Démarrer le serveur backend :

```bash
npm run server
```

L'application sera disponible à l'adresse `http://localhost:5173`

## Structure du Projet

```
├── src/
│   ├── components/     # Composants React
│   ├── context/       # Providers de contexte React
│   ├── services/      # Services API
│   ├── lib/           # Fonctions utilitaires
│   └── hooks/         # Hooks React personnalisés
├── server/
│   ├── controllers/   # Contrôleurs de routes
│   ├── models/        # Modèles Mongoose
│   ├── routes/        # Routes Express
│   └── middleware/    # Middleware Express
```

## Documentation API

### Authentification

- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/profile` - Obtenir le profil utilisateur
- `PUT /api/auth/profile` - Mettre à jour le profil utilisateur

### Messages

- `POST /api/messages` - Envoyer un message
- `GET /api/messages/:conversationId` - Obtenir les messages d'une conversation
- `PUT /api/messages/:messageId/read` - Marquer un message comme lu
- `PUT /api/messages/:messageId/favorite` - Basculer un message en favori

### Conversations

- `GET /api/conversations` - Obtenir les conversations de l'utilisateur
- `POST /api/conversations` - Créer une nouvelle conversation
- `GET /api/conversations/unread` - Obtenir le nombre de messages non lus

### Appels

- `POST /api/calls` - Créer un nouvel appel
- `PUT /api/calls/:callId` - Mettre à jour le statut d'un appel
- `GET /api/calls/history` - Obtenir l'historique des appels

### Amis

- `POST /api/friends/request` - Envoyer une demande d'ami
- `PUT /api/friends/request/:requestId` - Répondre à une demande d'ami
- `GET /api/friends/requests` - Obtenir les demandes d'ami en attente
