module.exports = (plop) => {
  // plop.setDefaultInclude({ actionTypes: true });
  //
  plop.load('plop-pack-json-modify')
  plop.setGenerator('service', {
    description: 'Creates a new service.',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "What's the name of the service"
      }
    ],
    actions: () => {
      return [
        {
          // Test Objects
          type: 'json-modify-file', // Strategy to use
          force: true,
          JSONFile: './destination.json', // The file to modify
          JSONKey: "routesObj",  // Where in the json file we add ourselves? - Can do root?
          JSONEntryKey: '{{pascalCase name}}', // if missing use array
          JSONEntryValue: {
            mountpath: '/{{name}}',
            module: '{{name}}/{{name}}_router'
          }
        },
        {
          // Test Nested Objects
          type: 'json-modify-file', // Strategy to use
          force: true,
          JSONFile: './destination.json', // The file to modify
          JSONKey: 'nestedObj', // Where in the json file we add ourselves? - Can do root?
          JSONEntryKey: '{{pascalCase name}}', // if missing use array
          JSONEntryValue: {
            child1a: {
              child2a: {
                '{{camelCase name}}': '{{name}} {{camelCase name}} {{snakeCase name}}',
                test: 'test'
              },
              child2b: {
                test: 'test'
              }
            },
            child1b: {
              '{{camelCase name}}': '{{dashCase name}} {{dotCase name}} {{pathCase name}}',
              test: 'test'
            }
          },
        },
        {
          // Arrays
          type: 'json-modify-file', // Strategy to use
          force: true,
          JSONFile: './destination.json', // The file to modify
          JSONKey: "modulesArray",  // Where in the json file we add ourselves? - Can do root?

          JSONEntryValue: {
            mountpath: '/{{name}}',
            module: '{{name}}/{{name}}_router'
          }
        }
      ]
    }
  })
}
