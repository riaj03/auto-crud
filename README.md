# rest

## Usages

- Install dependencies:
  - Run: `npm install`
- Install this project globally
  - Run : `npm install -g .`
- Create a json file with configs like bellow

  ```
  {
  "projectDbPath": "{DB_PATH_OF_PROJECT}",
  "models": [
    {
      "name": "Client",
      "attributes": [
        { "name": "firstName", "type": "string" },
        { "name": "lastName", "type": "string" },
        { "name": "firstNameFurigana", "type": "string" },
        { "name": "lastNameFurigana", "type": "string" },
        { "name": "dob", "type": "date" },
        { "name": "email", "type": "string" },
        { "name": "isMember", "type": "boolean" }
      ],
      "associations": [],
      "routes": [
        { "url": "/api/clients", "method": "createModel" },
        { "url": "/api/clients/:id", "method": "updateModel" },
        { "url": "/api/clients/:id", "method": "patchModel" },
        { "url": "/api/clients/", "method": "getModels" },
        { "url": "/api/clients/:id", "method": "getModel" }
      ],
      "controller_dir_name": "client",
      "model_dir_name": "clients",
      "routes_dir_name": "clients"
    }
  ]
  }

  ```

  Create a below folder structure in project root directory.

- src

  - packages

    - `packageName`

      - db
      - queryParser

        - queryParser.ts

      - routes
        1. index.ts
        2. urls.ts

- Now go to inside `db` folder from terminal and run below command.

  - Run: `sequelize init`

- Now go to inside `queryParser.ts` file and paste those below code.

```
'use strict';

const db = require('../db/models');
const queryParser = require('sequelize-query')(db);

module.exports = queryParser;
```

- Generate rest apis

  - Run: `rest {CONFIG_FILE_PATH}`

- Modify the `username , password` and `database` name inside `db/config/config.ts`

- Build your project

  - Run: `npm run build`

- Migrate your project

  - Run: `npx sequelize-cli db:migrate`

- Copy all from `db/config/config.ts` and paste it inside `dist/packages/user/db` folder

- Run your project
  -Run: `npm run watch`
