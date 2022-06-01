# rest

## Usages

- Install dependencies:
  - Run: `npm install`
- Install this project globally
  - Run : `npm install -g .`
- Create a json file with configs like bellow

  ```
  {
    "projectDbPath": "/home/zahirul/groots/waris-backend/src/packages/user/db/",
    "models": [
        {
            "name": "Message",
            "attributes": [
                {
                    "name": "tag",
                    "types": [
                        {
                            "name": "type",
                            "value": "noentry"
                        },
                        {
                            "name": "allowNull",
                            "value": false
                        },
                        {
                            "name": "defaultValue",
                            "value": true
                        },
                        {
                            "name": "maxLength",
                            "value": 100
                        }
                    ]
                },
                {
                    "name": "fristName",
                    "types": [
                        {
                            "name": "type",
                            "value": "string"
                        },
                        {
                            "name": "allowNull",
                            "value": false
                        },
                        {
                            "name": "defaultValue",
                            "value": true
                        },
                        {
                            "name": "maxLength",
                            "value": 100
                        }
                    ]
                }
            ],
            "associations": [
                {
                    "attributes": [
                        {
                            "name": "as",
                            "value": "type"
                        },
                        {
                            "name": "referenceKey",
                            "value": "id"
                        },
                        {
                            "name": "key",
                            "value": "foreignKey"
                        },
                        {
                            "name": "onUpdate",
                            "value": "true"
                        },
                        {
                            "name": "onDelete",
                            "value": "true"
                        }
                    ],
                    "method": "belongsTo",
                    "associated_model": "Type"
                }
            ],
            "routes": [
                {
                    "url": "/api/messages",
                    "method": "createModel"
                },
                {
                    "url": "/api/messages/:id",
                    "method": "updateModel"
                },
                {
                    "url": "/api/messages/:id",
                    "method": "patchModel"
                },
                {
                    "url": "/api/messages",
                    "method": "getModels"
                },
                {
                    "url": "/api/messages/:id",
                    "method": "getModel"
                },
                {
                    "url": "/api/messages/:id",
                    "method": "deleteModel"
                }
            ],
            "controller_dir_name": "group",
            "model_dir_name": "messages",
            "routes_dir_name": "messages"
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

- Copy `config` folder inside `db` folder and paste it inside `dist/packages/user/db` folder

- Run your project
  -Run: `npm run watch`
