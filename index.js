const fs = require('fs');
const json3 = require('json3');
const debug = require('debug')('json-modify-file');

/**
 * Load and parse content or return empty object
 */
function readJSON(filename) {
    try {
        const content = fs.readFileSync(filename, "utf-8");
        const json = json3.parse(content)
        return json;
    } catch (error) {
        console.error('[Error loading JSON]', error);
        return {};
    }
}
/**
 * Replaces handlevars per property
 */
function replaceObj(value, vars, plop) {
    let obj = value;
    Object.keys(obj).forEach(function (item) {
        obj[item] = plop.renderString(obj[item], vars);
    });
    return obj;
}
/**
 * Replaces text or pass to object replacement
 */
function replace(value, vars, plop) {
    return (typeof value === "object") ? replaceObj(value, vars, plop) : plop.renderString(value, vars);
}

module.exports = function (plop, cfg) {

    // setup config defaults
    let config = Object.assign({
        prefix: 'json',
        force: false
    }, cfg || {});

    plop.setDefaultInclude({ actionTypes: true });
    plop.setActionType(`${config.prefix}-modify-file`, appendtoJSONFile);


    function appendtoJSONFile(vars, config, plop) {
        return new Promise((resolve, reject) => {
            try {
                const file_json = readJSON(config.JSONFile);
                let json = appendJSON(file_json, vars, config, plop)
                fs.writeFileSync(config.JSONFile,
                    JSON.stringify(json, null, 2))
                resolve('Success');

            } catch (error) {
                reject(error);
            }
        });

    }


    /**
   * Inserts entries into JSON arrays or objects
   * * Split for easier testing
   *
   * Objects: pass property JSONEntryKey,
   * otherwise the value is inserted as arrays
   * @method
   * @param  {string}   key   JSON attribute (the array or object) to append to
   * @param  {string || object}   value The string or object to appendJSON
   * @param  {object}   vars  User input on prompts passed by plop
   * @return {json}   modified JSON
   */
    // function appendJSON(json, vars) {
    function appendJSON(json, vars, config, plop) {
        // JSON attribute to modify, allows templates
        let property_name = config.hasOwnProperty("JSONEntryKey") ?
            plop.renderString(config.JSONEntryKey, vars) : null;

        debug(`Targets \nFile: ${config.JSONFile}\nForce:${config.force} (Replaces existing)\nTarget property: ${config.JSONKey}\nType:${property_name ? 'Object:' + property_name : 'Array'}`);


        // If key exists use otherwise force OR error
        if (!json.hasOwnProperty(config.JSONKey)) {
            if (!config.force) {
                throw 'JSON has no property: ' + config.JSONKey;
            } else {
                const emptyCollection = property_name ? {} : [];
                json[config.JSONKey] = emptyCollection;
            }
        }

        // If object and prop exists then force or error
        if (!config.force && property_name && json[config.JSONKey].hasOwnProperty(property_name)) {
            throw "Attribute: " + property_name + ' already exist in ' + config.JSONKey
        }
        // Process the Value - change this for handlebars
        let insert_val = replace(config.JSONEntryValue, vars, plop);
        debug(`Adding: `, insert_val);

        // Choosing object (key:value) OR push(value)
        if (property_name) {
            json[config.JSONKey][property_name] = insert_val;
        } else {
            if (Array.isArray(json[config.JSONKey])) {
                json[config.JSONKey].push(insert_val);
            } else {
                throw `Array expected, did you forget to add a JSONEntryKey?`
            }
        }
        return json;
        //   return json;
    }


}
