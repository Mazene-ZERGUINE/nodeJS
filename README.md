# Pre-requis

- Avoir PostgreSQL
- Avoir créé une base de données "zoo".

# Lancement

- A la racine, créer un fichier `.env` avec des valeurs que vous souhaitez :

```
SERVER_HOST=localhost
SERVER_PORT=3000

DB_NAME=zoo
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root

SECRET="youre_api_key"
```

- Lancer le serveur avec :

```
npm run start
```

- Lancer les migrations si nécessaire :

```
sequelize db:migrate
```
