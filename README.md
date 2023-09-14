# Auto-CRUD

Auto-CRUD is a Node.js project that generates REST APIs from JSON configurations. It relies on Sequelize and Express as its dependencies. Follow the steps below to get started:

## Installation

- Install project dependencies:
  
  - Run: `npm install`

- Build project
  - `npm run build`
  
- Install this project globally
  - Run : `npm install -g .`


## Configuration
Before generating REST APIs, you need to create a JSON configuration file. Here's an example configuration:

  ```
  {
  "projectDbPath": "/path/to/your/database.db",
  "models": [
    {
      "name": "User",
      "attributes": [
        { "name": "firstName", "type": "string" },
        { "name": "lastName", "type": "string" },
        { "name": "email", "type": "string", "unique": true },
        { "name": "password", "type": "string" }
      ],
      "associations": [
        {
          "type": "belongsTo",
          "targetModel": "Role",
          "as": "role"
        }
      ],
      "routes": [
        { "url": "/api/users", "method": "createModel" },
        { "url": "/api/users/:id", "method": "updateModel" },
        { "url": "/api/users/:id", "method": "patchModel" },
        { "url": "/api/users/", "method": "getModels" },
        { "url": "/api/users/:id", "method": "getModel" },
        { "url": "/api/users/:id/role", "method": "getRelatedModel", "relation": "role" }
      ],
      "controller_dir_name": "user",
      "model_dir_name": "users",
      "routes_dir_name": "users"
    },
    {
      "name": "Role",
      "attributes": [
        { "name": "name", "type": "string" },
        { "name": "description", "type": "text" }
      ],
      "associations": [],
      "routes": [
        { "url": "/api/roles", "method": "createModel" },
        { "url": "/api/roles/:id", "method": "updateModel" },
        { "url": "/api/roles/:id", "method": "patchModel" },
        { "url": "/api/roles/", "method": "getModels" },
        { "url": "/api/roles/:id", "method": "getModel" }
      ],
      "controller_dir_name": "role",
      "model_dir_name": "roles",
      "routes_dir_name": "roles"
    }
  ]
}


  ```
## Usage
- `rest {CONFIG_FILE_PATH}`

Replace {CONFIG_FILE_PATH} with the path to your JSON configuration file.

Now, you can easily create RESTful APIs for your project using Auto-CRUD. Enjoy!
