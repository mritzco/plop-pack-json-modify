const fs = require('fs-extra');

module.exports = function (plop, cfg) {

	// setup config defaults
	let config = Object.assign({
		prefix: 'json',
	}, cfg || {});

  plop.setDefaultInclude({ helpers: true });

	plop.addHelper(`${config.prefix}-modify`, appendJSON);
	plop.addHelper(`${config.prefix}-modify-file`, appendtoJSONFile);
	// Just for testing. Config is per module / object
	// plop.addHelper('setconfig', function (_config){ config = _config });
  /**
   * Inserts entries into JSON arrays or objects in a file
   *
   * To use with objects be sure to pass the property JSONEntryKey,
   * otherwise the value is inserted as arrays
   * @method
   * @param  {string}   file  filename with the JSONKey
   * @param  {string}   key   JSON attribute (the array or object) to append to
   * @param  {string || object}   value The string or object to appendJSON
   * @param  {object}   vars  User input on prompts passed by plop
   * @param  {Function} cb    callback, after file has been saveSidebarRef
   * @return {callback(err)}   Async callback with err or null if success.
   */
	function appendtoJSONFile(vars, cb) {
		fs.readJSON(config.JSONFile, {}, (err, file_json) => {
			let json = appendJSON(file_json, vars)

			fs.writeJSON(config.JSONFile, json, {spaces: 2}, err => {
					cb(err);
			});
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
  function appendJSON(json, vars) {

      let attribute_name = config.hasOwnProperty("JSONEntryKey") ?
              replaceStr(config.JSONEntryKey, vars) : null;

      // Validate JSON is correct - we don't autoadd only append top level
      if (!json.hasOwnProperty(config.JSONKey)) {
          return cb('JSON has no property: ' + config.JSONKey);
      }

      if (!config.force && attribute_name && json[config.JSONKey].hasOwnProperty(attribute_name)) {
          return cb("Attribute: " + attribute_name + ' already exist in ' + config.JSONKey)
      }
      // the value with replacements
      let insert_val = replace(config.JSONEntryValue, vars);
      // Choosing object (key:value) OR push(value)
      if (attribute_name) {
          json[config.JSONKey][attribute_name] = insert_val;
      } else {
          json[config.JSONKey].push( insert_val);
      }
			return json;
  }
  function replaceObj(value, vars) {
      let obj = value;
      Object.keys(obj).forEach(function(item) {
          obj[item] = replaceStr(obj[item], vars);
      });
      return obj;
  }

  // Not optimized, if multiple can create an object with name:regex({{name}})
  function replaceStr(value, vars) {
      let val = value;
      Object.keys(vars).forEach(function(var_key) {
          let find = new RegExp( '{{' + var_key + '}}' , "g");
          val = val.replace(find, vars[var_key]);
      });
      return val;
  }
  function replace(value, vars) {
      return (typeof value === "object") ? replaceObj(value, vars) : replaceStr(value, vars);
  }
}
