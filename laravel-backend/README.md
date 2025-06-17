# Wedding Management API - Laravel Backend

## Installation

1. Cloner le projet et naviguer dans le dossier backend :
```bash
cd laravel-backend
```

2. Installer les dépendances :
```bash
composer install
```

3. Copier le fichier d'environnement :
```bash
cp .env.example .env
```

4. Générer la clé d'application :
```bash
php artisan key:generate
```

5. Configurer la base de données dans le fichier `.env` :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wedding_management
DB_USERNAME=root
DB_PASSWORD=
```

6. Créer la base de données :
```sql
CREATE DATABASE wedding_management;
```

7. Exécuter les migrations :
```bash
php artisan migrate
```

8. (Optionnel) Exécuter les seeders pour avoir des données de test :
```bash
php artisan db:seed
```

9. Démarrer le serveur de développement :
```bash
php artisan serve
```

L'API sera accessible sur `http://localhost:8000`

## Endpoints API

### Wedding Info
- `GET /api/wedding` - Récupérer les informations du mariage
- `PUT /api/wedding` - Mettre à jour les informations du mariage

### Guests
- `GET /api/guests` - Lister tous les invités
- `POST /api/guests` - Créer un nouvel invité
- `GET /api/guests/{id}` - Récupérer un invité spécifique
- `PUT /api/guests/{id}` - Mettre à jour un invité
- `DELETE /api/guests/{id}` - Supprimer un invité

### Tables
- `GET /api/tables` - Lister toutes les tables
- `POST /api/tables` - Créer une nouvelle table
- `GET /api/tables/{id}` - Récupérer une table spécifique
- `PUT /api/tables/{id}` - Mettre à jour une table
- `DELETE /api/tables/{id}` - Supprimer une table

### Budget
- `GET /api/budgets` - Lister tous les éléments du budget
- `POST /api/budgets` - Créer un nouvel élément de budget
- `GET /api/budgets/{id}` - Récupérer un élément de budget spécifique
- `PUT /api/budgets/{id}` - Mettre à jour un élément de budget
- `DELETE /api/budgets/{id}` - Supprimer un élément de budget

### Tasks
- `GET /api/tasks` - Lister toutes les tâches
- `POST /api/tasks` - Créer une nouvelle tâche
- `GET /api/tasks/{id}` - Récupérer une tâche spécifique
- `PUT /api/tasks/{id}` - Mettre à jour une tâche
- `DELETE /api/tasks/{id}` - Supprimer une tâche

### Statistics
- `GET /api/statistics` - Récupérer les statistiques globales

## Configuration CORS

Le CORS est configuré pour accepter les requêtes depuis `localhost:4200` (Angular dev server).

## Structure de la base de données

- **weddings** : Informations principales du mariage
- **guests** : Liste des invités avec leurs informations
- **tables** : Configuration des tables de réception
- **budgets** : Éléments du budget avec suivi des dépenses
- **tasks** : Tâches à accomplir pour l'organisation

Toutes les tables sont liées à la table `weddings` via une clé étrangère `wedding_id`.