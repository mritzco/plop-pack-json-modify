# plop-pack-json-modify

Modify JSON files with a custom plop action type. Can add object key-values or push to arrays.

## Installation
```
npm install --save plop-pack-json-modify
```

#### Generators included
- **json-modify-file**. Modifiers JSON file


## Usage
- Load
- Configure actions

```
// popfile.js
module.exports = (plop) => {
  # Load the action
  plop.load('plop-pack-json-modify')
  ...
  # Use in actions
  {
        type: 'json-modify-file', // Point to this action
        force: true,              // Overrides, create non existing
        JSONFile: './destination.json', // File to modify
        JSONKey: "routesObj",  // Property to append to
        JSONEntryKey: '{{pascalCase name}}', // Property to add
        JSONEntryValue: { // value to add
          mountpath: '/{{name}}',
          module: '{{name}}/{{name}}_router'
        }
      }
  }
```


### Properties

Valid configuration options:

- **force**.
    - False: Will respect existing data and structures.
    - True: Will override existing keys, will create target collection if missing.
- **JSONFile**. File to modify
- **JSONKey**. Property in the JSON to modify.
- **JSONEntryKey**. When adding `Objects` the property to create. For arrays **don't use.**
- **JSONEntryValue**. Value to add to array or to JSONEntryKey.


#### Example:
Modify this file:
```js
// destination.json  - You can start with {} if using force=true
{
    routesObj: {},
    modulesArray: []
}
```

With this input:
```
  {  name: page }
```

Will result in:
```js
//result.js
{
  "routesObj": {
    "Page": {
      "mountpath": "/page",
      "module": "page/page_router"
    }
  },
  "modulesArray": [
    {
      "mountpath": "/page",
      "module": "page/page_router"
    }
  ]
}

```

Using this plop file:
```js
// plopfile.js
module.exports = (plop) => {
  // plop.setDefaultInclude({ actionTypes: true });
  //
  plop.load('plop-pack-json-modify')
  plop.setGenerator('service', {
    description: 'Create a new something.',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "What's the service name?"
      }
    ],
    actions: () => {
      return [
       {

        type: 'json-modify-file',
        force: true,
        JSONFile: './destination.json',
        JSONKey: "routesObj",  
        JSONEntryKey: '{{pascalCase name}}',
        JSONEntryValue: {
          mountpath: '/{{name}}',
          module: '{{name}}/{{name}}_router'
        }
      },
       {
         // Arrays
        type: 'json-modify-file',
        force: true,
        JSONFile: './destination.json',
        JSONKey: "modulesArray",  
        JSONEntryValue: {
          mountpath: '/{{name}}',
          module: '{{name}}/{{name}}_router'
        }
      }
    ]
  }
  })
}

```

### Debugging
`Debug` package added run with:
`DEBUG=json-modify-file plop`

#### Plop repo and instruction:
  https://github.com/amwmedia/plop
