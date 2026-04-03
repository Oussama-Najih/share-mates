# ShareMates

Plateforme collaborative permettant aux étudiants de partager et d’accéder à des supports de cours de manière structurée et organisée.

![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=for-the-badge&logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

---

## 🎯 Objectif

ShareMates facilite le partage de ressources académiques entre étudiants en offrant une structure claire pour organiser les cours, examens, contrôles, TD et TP par matière.

---

## ✅ Fonctionnalités principales

### 📚 Gestion des publications
- **Partage de supports** : Cours, examens, contrôles, TD et TP  
- **Catégorisation par matière** : Organisation par modules d’enseignement  
- **Pièces jointes multiples** : Images et fichiers PDF  

### 💬 Interactions sociales
- **Commentaires imbriqués** (réponses en cascade)  
- **Réactions** (likes sur les posts et commentaires)  
- **Notifications par polling** pour likes, commentaires et réponses  

### 📢 Annonces administratives
- **Panneau d’annonces** pour communication officielle  
- **Support média** pour images et documents  

### 👤 Gestion des utilisateurs
- **Authentification sécurisée** avec NextAuth  
- **Rôles utilisateurs** : USER / ADMIN  
- **Profils personnalisés**  

---

## 🧱 Architecture technique

### Frontend
- **Next.js 15.1.7** (App Router)  
- **React 19**  
- **TypeScript**  
- **Tailwind CSS**  
- **Shadcn UI**  
- **TanStack Query**  

### Backend
- **Next.js API Routes**  
- **Prisma ORM**  
- **PostgreSQL (Neon)**  
- **NextAuth**  

### Outils
- **UploadThing** (uploads fichiers)  
- **React Hook Form + Zod** (validation)  
- **Zustand** (state management)  

---

## ⚙️ Installation

### Prérequis
- Node.js 20+  
- PostgreSQL (ou compte Neon Database)  
- Compte UploadThing  

### 1. Cloner le projet
```bash
git clone <repository-url>
cd sharemates
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d’environnement
Créer un fichier `.env` :

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3005"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

### 4. Initialiser la base de données
```bash
npx prisma generate
npx prisma db push
```

### 5. Lancer le serveur
```bash
npm run dev
```

L’application sera accessible sur **http://localhost:3005**

---

## 📜 Scripts disponibles

```bash
npm run dev        # Mode développement
npm run build      # Build production
npm run start      # Lancer en production
```

---

## 🔐 Sécurité

- Authentification robuste avec NextAuth  
- Mots de passe hashés avec bcrypt  
- Validation des données avec Zod  
- Protection CSRF intégrée  

---

## 🎨 UI / UX

- Design responsive (mobile / tablette / desktop)  
- Mode sombre / clair  
- Composants réutilisables  
- Animations fluides  
- Notifications toast  

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Forkez le projet  
2. Créez une branche (`git checkout -b feature/amelioration`)  
3. Committez vos changements (`git commit -m "Ajout d'une fonctionnalité"`)  
4. Pushez (`git push origin feature/amelioration`)  
5. Ouvrez une Pull Request  

---

## 📄 Licence

Projet développé à des fins éducatives.

---

**Développé par Oussama Najih**  
**ShareMates** — Partagez vos connaissances, réussissez ensemble !