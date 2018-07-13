# plop-pack-json-modify

### What's plop?
A really cool micro-generator framework to generate code or other files.

You can think of it as a super light alternative to Yeoman.

### What's this package?
This package is a plugin for plop, it modifies JSON files.
It can insert data in arrays or in objects.

Case example:
- Generate some js modules (using standard plop functionality)
- Add the new module to a config.json file

#### Generators included
- **appendJSON**. Modifies a JSON
- **appendJSONFile**. Opens, modifies and store a JSON file


### How to use
- For instructions on how to use npm packages, check plop site (link at the end)
- Sample for this package:

```js
// filename.json  
{
    routes: {},
    modules: []

}
```

```.js
// plopfile.js
// Only relevant configuration
{
    type: 'appendJSONFile',     /* appendJSON || appendJSONFile */
    JSONFile: "filename.json",  /* For appendJSONFile  */
    JSONKey: "routes",          /* Key to modify: routers: {} || [] */
    JSONEntryKey: "{{name}}_key"/* For objects, key to insert */
    JSONEntryValue: {
        "mountpath": "/{{name}}",
        "module": "{{name}}/{{name}}_router"
    }
}
```
Example:

    name=page

```js
//result.js
{
    routes: {
        page_key : {
            "mountpath": "/page",
            "module": "page/page_router"
        }
    },
    modules: []

}

```

For inserting into 'modules' array instead:
```js
// plopfile.js
{
    type: 'appendJSONFile',
    JSONFile: "filename.json",
    JSONKey: "modules",      
    JSONEntryValue: {
        "mountpath": "/{{name}}",
        "module": "{{name}}/{{name}}_router"
    }
}
```


#### Plop repo and instruction:
  https://github.com/amwmedia/plop
