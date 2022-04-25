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
