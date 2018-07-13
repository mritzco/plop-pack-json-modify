# plop-pack-json-modify

Modify JSON files with a custom plop action type.

## Installation
```
npm install --save plop-pack-json-modify
```

#### Generators included
- **appendJSON**. Modifies a JSON
- **appendJSONFile**. Opens, modifies and store a JSON file


## Usage
In your base plopfile, use plop.load
```
const aGenerator = require("./path/to/a/generator");

module.exports = function(plop) {
    plop.load("plop-pack-json-modify");

    plop.setGenerator("Generator Name", aGenerator);
};
```



### How to use

Valid configuration options:

```.js
// plopfile.js
{
    type: 'appendJSONFile',       /* appendJSON || appendJSONFile */
    JSONFile: "filename.json",    /* For appendJSONFile  */
    JSONKey: "routes",            /* JSON key to modify: routes: {} || [] */
    JSONEntryKey: "{{name}}_key"  /* For objects, key to insert */
    JSONEntryValue: {             /* Any valid JSON content */
        "mountpath": "/{{name}}",
        "module": "{{name}}/{{name}}_router"
    }
}
```

#### Example:
```js
// filename.json  
{
    routes: {},
    modules: []

}
```

Plop variables:

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
