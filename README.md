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

- Generate rest apis
  - Run: `rest {CONFIG_FILE_PATH}`
