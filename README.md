# Todo List App - Documentation Technique

Application de gestion de tâches en React Native utilisant Expo et TypeScript.

## 🎬 Démo

https://github.com/user-attachments/assets/3dd74f7e-d77a-45d3-8511-840dada42bc2

## 🚀 Installation et Lancement

```bash
# Installation des dépendances
npm install

# Lancer l'application (par défaut avec expo go)
npm start

# Lancer sur une plateforme spécifique
npm run android
npm run ios
npm run web

# Vérification TypeScript
npx tsc --noEmit
```

## 📋 Fonctionnalités Implémentées

### Fonctionnalités Utilisateur
- **Authentification simulée** - Sélection parmi 5 utilisateurs mock
- **CRUD complet** - Créer, lire, modifier, supprimer des todos
- **Filtrage** - Afficher tous / actifs / complétés
- **Recherche** - Recherche textuelle avec debouncing (300ms)
- **Toggle completion** - Marquer comme complété/non complété
- **Pull-to-refresh** - Actualiser la liste
- **Optimistic updates** - Feedback instantané sur toutes les mutations
- **Gestion d'erreurs** - Affichage des erreurs avec possibilité de dismiss
- **États vides** - Messages contextuels (aucun todo, recherche vide, etc.)

## 🏗️ Architecture

### Stack Technique

- **React Native**
- **Expo Router** - Routing file-based (v6)
- **TypeScript** - Strict mode activé
- **Zustand** - Gestion d'état simple et efficace (suffisant pour un projet de cette taille/complexité)
- **DummyJSON API** - API de test qui simule les actions d'ajout/modification (https://dummyjson.com)
- **React Native StyleSheet** - Styling manuel

## 🎯 Approche de Développement

### Stratégie de Développement

Ma stratégie pour ce test technique a été la suivante :

**1. MVP d'abord, refactoring ensuite**

Arriver rapidement à une version qui fonctionne en m'aidant de **Claude Code** en lui donnant les directives les plus claires possibles pour qu'il m'aide à construire une base solide.

> 💡 **Philosophie :** Pour moi le plus important est d'avoir quelque chose à livrer même si le code a un peu de dette technique → **mieux vaut un code imparfait en prod qu'un code parfait qui n'a jamais été livré**.

**2. Amélioration itérative**

Une fois cette première version obtenue, je me suis penché plus en détail sur l'implémentation et comment l'améliorer pour avoir un code le plus maintenable et évolutif possible. De plus, je sais combien il est important de poser de bonnes bases pour pouvoir par la suite avancer encore plus vite, notamment en utilisant l'IA générative qui donnera un bien meilleur résultat en partant d'une base saine.

**3. Refactoring ciblé**

J'ai procédé à plusieurs refactorings pour extraire des composants ou de la logique afin d'avoir une séparation claire des concepts. Mon but étant d'arriver à un résultat satisfaisant **sans tomber dans la sur-ingénierie**.

### Choix Assumé

**Pas de tests dans ce projet**

J'ai choisi de ne pas ajouter de tests sur ce projet. En effet, le setup des tests sur les projets mobiles peut prendre pas mal de temps en raison des modifications à faire sur la config et notamment sur celle de Babel. J'ai donc préféré passer du temps à faire du refactoring plutôt que de la configuration.

> ⚠️ **Important :** C'est un parti pris pour ce test technique. **Dans un projet de production, j'aurais évidemment mis des tests en place** (Jest, React Native Testing Library, Detox pour l'E2E).


### Structure du Projet

```
app/                    # Expo Router - Routes
├── _layout.tsx        # Configuration racine
├── index.tsx          # Écran de login (/)
├── modal.tsx          # Modal d'ajout (/modal)
└── todos/
    ├── _layout.tsx    # Layout protégé (AuthGuard + TodoDataProvider)
    ├── index.tsx      # Liste des todos (/todos)
    └── [id].tsx       # Édition d'un todo (/todos/:id)

lib/                    # Logique métier
├── api/
│   └── TodoRepository.ts      # Couche d'accès aux données (fetch direct)
├── components/                # Composants React
│   ├── ui/                    # Composants UI purs (design system)
│   │   ├── AppHeader.tsx      # Header avec info user + logout
│   │   ├── Avatar.tsx         # Avatar emoji avec variantes de taille
│   │   ├── Button.tsx         # Bouton Primary/Secondary
│   │   ├── CharacterCount.tsx # Compteur de caractères
│   │   ├── ErrorBanner.tsx    # Bannière d'erreur inline
│   │   ├── FAB.tsx            # Floating Action Button
│   │   ├── Input.tsx          # Input texte avec label/erreur
│   │   ├── PageHeader.tsx     # Header de page titre/sous-titre
│   │   └── UserCard.tsx       # Carte de sélection utilisateur
│   ├── AuthGuard.tsx          # Protection des routes (logique)
│   ├── EmptyState.tsx         # Affichage état vide (logique)
│   ├── ErrorMessage.tsx       # Message erreur + retry (logique)
│   ├── LoadingSpinner.tsx     # Indicateur de chargement
│   ├── SearchBar.tsx          # Barre de recherche
│   ├── TodoFilters.tsx        # Filtres (All/Active/Completed)
│   └── TodoItem.tsx           # Item de la liste de todos
├── hooks/
│   ├── useDebounce.ts         # Hook de debouncing (performance)
│   └── useTodos.ts            # Wrapper autour du store Zustand
├── providers/
│   └── TodoDataProvider.tsx   # Gestion centralisée du cycle de vie des données
├── screens/                   # Écrans de l'application
│   ├── LoginScreen.tsx        # Sélection de l'utilisateur
│   ├── TodoFormScreen.tsx     # Formulaire d'édition
│   └── TodoListScreen.tsx     # Liste principale
├── stores/                    # Zustand stores
│   ├── useAuthStore.ts        # État d'authentification
│   └── useTodoStore.ts        # État des todos (CRUD + filtres)
├── theme/                     # Design system
│   └── colors.ts              # Palette de couleurs centralisée
├── types/                     # Types TypeScript
│   ├── Todo.ts                # Entity du domaine
│   ├── TodoDTO.ts             # Types API + mappers
│   └── User.ts                # Type User
└── utils/
    ├── config.ts              # Configuration (API URL, users mock)
    └── validation.ts          # Validation des inputs
```

## 🎯 Décisions d'Architecture

### 1. Architecture Simplifiée (Clean Architecture Light)

**Décision :** Adopter une architecture qui favorise la séparation des concepts sans tomber dans la sur-ingénierie.

**Justification :**
- Séparation claire : API ↔ Stores ↔ UI
- Pas d'interfaces ou use cases inutiles (YAGNI)
- Maintenabilité sans complexité excessive

### 2. DTO Mapping Pattern

**Décision :** Transformer les réponses API (DTOs) en entités du domaine.

**Justification :**
- Découplage entre la structure API et le modèle métier
- Permet de changer l'API sans impacter le reste de l'app
- Nommenclature cohérente (API utilise `completed`, domain utilise `isCompleted`)

### 3. Optimistic Updates

**Décision :** Mise à jour optimiste de l'UI pour toutes les mutations.

**Justification :**
- UX instantanée (pas d'attente du serveur)
- Perception de performance accrue
- L'API DummyJSON ne persiste pas les données de toute façon

### 4. TodoDataProvider - Gestion Centralisée des Données

**Décision :** Créer un provider qui gère le cycle de vie des données.

**Justification :**
- Fetch automatique au login
- Clear automatique au logout
- Indépendant des composants d'écran
- Si on change `TodoListScreen`, le chargement des données continue de fonctionner

### 5. Store Wrapper (useTodos Hook)

**Décision :** Créer un hook qui wrappe le store Zustand.

**Justification :**
- Abstraction de l'implémentation Zustand
- Fournit des valeurs calculées (todos filtrés, counts)
- Injecte automatiquement le user courant
- Démontre la réutilisabilité du code

**Trade-off :**
- Ajoute une couche d'abstraction
- Pour une petite app, on pourrait utiliser les stores directement
- **Choix :** Garder le pattern pour démontrer les bonnes pratiques

### 6. Debouncing pour la Recherche

**Décision :** Debounce de 300ms sur la recherche.

**Justification :**
- Évite le re-filtrage à chaque frappe
- Performance (moins de re-renders)
- Meilleure UX (pas de lag pendant la saisie)

### 7. AuthGuard Pattern

**Décision :** Composant centralisé pour la protection des routes.

**Justification :**
- Évite la duplication de la logique d'auth dans chaque route
- Redirections automatiques (login ↔ todos)
- Code plus maintenable

### 8. Conventions de Types TypeScript

**Décision :** Utiliser `null` pour les échecs d'opérations, `undefined` pour les optionnels.

**Justification :**
- `null` = "opération réussie, mais pas de données" (intentionnel)
- `undefined` = "non initialisé" ou "optionnel" (accidentel)
- Convention industry standard pour les APIs

### 9. Séparation Composants UI / Logique

**Décision :** Séparer les composants UI purs dans `lib/components/ui/` des composants avec logique.

**Composants UI Purs (`lib/components/ui/`):**
- Aucune logique métier, pas de hooks (sauf useState pour l'UI interne)
- Reçoivent toutes les données via props
- Foundation pour un design system
- **Exemples :** Button, FAB, Input, Avatar, AppHeader, PageHeader, UserCard, ErrorBanner, CharacterCount

**Composants avec Logique (`lib/components/`):**
- Utilisent des hooks (useTodos, useAuthStore, etc.)
- Gèrent le fetching de données, la gestion d'état
- **Exemples :** AuthGuard, TodoItem, TodoFilters, SearchBar, EmptyState, ErrorMessage

**Justification :**
- Plus facile à tester (composants UI purs)
- Réutilisables dans différents contextes
- Séparation claire des responsabilités
- Base pour Storybook/design system

### 10. Palette de Couleurs Centralisée

**Décision :** Toutes les couleurs définies dans `lib/theme/colors.ts`.

**Justification :**
- Source unique de vérité pour les couleurs
- Facilite le changement de thème
- Type-safe avec `as const`
- Foundation pour le dark mode

**Trade-off :**
- **Avantage :** Cohérence, maintenabilité, évolutivité
- **Avantage :** Autocomplétion TypeScript
- **Avantage :** Changement de couleur = 1 ligne modifiée

**Justification :** Pour un design system évolutif, la palette centralisée est indispensable.

## ⚖️ Trade-offs et Compromis

### 1. Zustand vs React Query

**Choix :** Zustand pour tout (server state + client state)

**Trade-off :**
- ✅ **Avantage :** Simplicité, une seule lib pour tout
- ✅ **Avantage :** Moins de boilerplate
- ❌ **Inconvénient :** Pas de cache sophistiqué, refetch automatique, etc.

**Justification :** Pour cette échelle de projet, Zustand suffit largement.

### 2. Emojis vs Bibliothèque d'Icônes

**Choix :** Utiliser des emojis (👨, 👩, ✅, 📋, etc.)

**Trade-off :**
- ✅ **Avantage :** Zero config, pas de dépendance supplémentaire
- ✅ **Avantage :** Fonctionne immédiatement sur toutes les plateformes
- ✅ **Avantage :** Développement plus rapide
- ❌ **Inconvénient :** Rendu inconsistant entre OS (iOS vs Android)
- ❌ **Inconvénient :** Pas de customisation (couleur, taille)
- ❌ **Inconvénient :** Moins professionnel
- 💡 **Alternative :** React Native Vector Icons ou Expo Icons

**Justification :** Choix pragmatique pour un prototype/POC. En production, on utiliserait une vraie bibliothèque d'icônes.

### 3. Mock Auth vs Vraie Auth

**Choix :** Authentification simulée (sélection d'utilisateur)

**Trade-off :**
- ✅ **Avantage :** Focus sur la logique métier, pas l'auth
- ✅ **Avantage :** Démo facile (pas de signup/login)
- ✅ **Avantage :** Permet de gérer un vrai state d'authentification
- ❌ **Inconvénient :** Les utilisateurs disponibles sont limités

**Justification :** DummyJSON n'a pas d'auth réelle. Le mock permet de démontrer l'architecture sans complexité inutile.

### 4. Silent Error Handling pour DummyJSON

**Choix :** Attraper silencieusement les erreurs de update/delete/toggle

**Contexte :** DummyJSON simule les mutations mais ne persiste pas réellement.

**Trade-off :**
- ✅ **Avantage :** UX fluide (pas d'erreurs constantes)
- ✅ **Avantage :** Optimistic updates fonctionnent bien
- ❌ **Inconvénient :** Masque les erreurs réelles
- ❌ **Inconvénient :** Pas de feedback si vraie erreur réseau

**Justification :** Spécifique à DummyJSON. En production avec une vraie API, on afficherait les erreurs.

## 🚀 Améliorations Futures

Si ce projet devait évoluer vers la production, voici les améliorations prioritaires :

### Performance & Optimisation
- **React Query** - Remplacer Zustand pour le server state (cache, refetch auto)
- **Virtualization** - Optimisation de la liste de todos.
- **Pagination** - La liste des todos de l'utilisateur devrait être chargée en utilisant une pagination et de ce fait le filtrage devrait se faire côté API.
- **Complexité** - Actuellement on a beaucoup de traitement en O(n), j'ajouterais une Map pour accèder aux todo en O(1), même si la complexité d'espace augmenterais je pense que cela pourrait valoir le coup;

### Architecture & Séparation des Préoccupations
- **Service Layer** - Extraire la logique métier (optimistic updates, orchestration) des stores Zustand vers une couche de services dédiée. Actuellement, `useTodoStore` gère à la fois l'état et l'orchestration des appels API. Pour un projet de plus grande envergure, séparer cette logique dans un `TodoService` permettrait une meilleure testabilité et réutilisabilité. 
**Trade-off :** Pour l'échelle actuelle du projet, la séparation actuelle (Repository → Store → Hook) est appropriée et évite la sur-ingénierie.

### UX/UI
- **Bibliothèque d'icônes** - React Native Vector Icons ou Expo Icons
- **Web** - Actuellement l'application est faite pour être utilisée sur mobile, si l'on veut l'utiliser sur le web ou tablette, il serait préférable d'améliorer les vues pour qu'elles soient agréables à utiliser sur ces plateformes.
- **Swipe actions** - Gestes de swipe pour delete/edit sur TodoItem
- **Design system** - Palette de couleurs, tokens de design, composants atomiques
- **Thème** - Définir et utiliser un thème

### Fonctionnalités
- **Offline-first** - Persistance locale (AsyncStorage ou SQLite)
- **Synchronisation** - Background sync quand online
- **Partage de todos** - Collaboration entre utilisateurs
- **Catégories/Tags** - Organiser les todos par projet
- **Due dates** - Dates d'échéance et rappels

### Qualité & Testing
- **Tests unitaires** - Jest + React Native Testing Library
- **Tests E2E** - Detox pour les flows critiques
- **Tests d'intégration** - MSW pour mocker l'API
- **CI/CD** - GitHub Actions (lint, test, build)
- **Error tracking** - Sentry ou BugSnag
- **Analytics** - Amplitude ou Mixpanel

### Backend
- **Vraie API** - Remplacer DummyJSON par un backend custom
- **Authentification** - OAuth2 ou JWT
- **Base de données** - PostgreSQL

### Accessibilité
- **Screen reader** - Labels accessibilité complets
- **Font scaling** - Support des tailles de texte personnalisées

## 📝 Notes Techniques

### TypeScript
- **Strict mode** activé (`tsconfig.json`)
- Path alias `@/*` pointe vers la racine du projet
- Tous les types sont explicites (pas de `any`)

### Expo Router
- Routing file-based (comme Next.js)
- `app/` directory = routes
- `[id].tsx` = dynamic routes
- Layouts imbriqués supportés

### Zustand (state management)
- Stores séparés par domaine (auth, todos)
- Actions retournent des Promises typées
- État minimal (pas de données dérivées dans le store)
- Utiliser `get()` pour accéder à l'état dans les actions
