# MANA News
### Nest.js, Postgres, JWT

### Enviroment Variables 
> use .env.example file as an example (project_folder/env/.env.example)

| Key| Definition | Example |
| :------------ | :------------ |:------------|
| PORT | Server Port | 3000 |
| PG_USER | Postgres User | postgres |
| PG_PASSWORD | Postgres Password | 1234 |
| PG_DATABASE | Postgres Database Name | mana-news |
| PG_HOST | Postgres Host | localhost |
| PG_PORT | Postgres Port | 5432 |

*** Make sure to create a database in postgres, called whatever you set in env file**
> Base url for files is `{HOST}:{PORT}/files/{FILE_URL}`
> Example `http://localhost:3002/files/news/image-news-1683072647974.jpg`

### Migration and Seeding
| Command | Enviroment |
| :------------ | :------------ |
| `npm run sequelize:dev` | Development |
| `npm run sequelize:local` | Local |
| `npm run sequelize:prod` | Production |


### Default Admin User (will be created by seeding)
| Mobile | Password |
| :------------ | :------------ |
| +989199119911 | Admin@1234 |
> You can change admin information in  (project_folder/src/database/seeders)

### Running the application
Start Dev
`npm run start:dev`

Start Local
`npm run start:local`

Start Prod
`npm run start:prod`