const fs = require('fs-extra');
const path = require('path');
const colors = require('colors');

const plop = {
	setDefaultInclude: function () {},
	addHelper: function (name, func) {
		helpers[name] = func;
	}
};
// User answers in plop interface
const answers = {
	name: 'theName'
}
// A quick assert object for this case
let assert = {
	total:0,
	passed:0,
	failed:0,
	equal : function (msg, value, expected) {
		this.total++;
		if (JSON.stringify(value) === JSON.stringify(expected)){
			console.log(colors.green('Passed:', msg));
			this.passed++;
		} else {
			this.failed++
			console.log(colors.red('Failed:', msg));
			console.log('Expected:');
			console.log(colors.dim( value ));
			console.log('to equal:');
			console.log(colors.dim(expected));
		}
	},
	show: function (){
		console.log('Test results \n Tests: ',this.total);
		console.log(colors.green(' Passed:'),this.passed)
		console.log(colors.red(' Failed:'), this.failed);
	}
};

// A configuration like the one used in plop, two entries for two different scenarios
const config = {
	array: {
			JSONKey: "someArray",
			JSONEntryValue: { "mountpath": "/{{name}}","module": "{{name}}/{{name}}_router"}
	},
	object: {
			JSONKey: "someObject",
			JSONEntryKey: "{{name}}",
			JSONEntryValue: { "mountpath": "/{{name}}","module": "{{name}}/{{name}}_router"}
	}
}

// - --------------   case 1, test array ----------------
// Setup and clear mocks
let lib = require('./index');
let helpers = {};
let expected_array = {"someArray":[{"mountpath":"/theName","module":"theName/theName_router"}],"someObject":{}};

lib(plop, config.array);

let res_array = helpers['json-modify']({'someArray':[],'someObject':{}},	answers);
assert.equal("Expect an array entry to be added",	res_array, expected_array);


// - ------------- case 2, test object -----------------
helpers = {};
let expected_obj = { someArray: [],	someObject: {
		"theName": {"mountpath":"/theName","module":"theName/theName_router" }
	}};

lib(plop, config.object);
let res_obj = helpers['json-modify']({'someArray':[],'someObject':{}}, answers);
assert.equal("Expect an Object entry to be added", 	res_obj,	expected_obj );


 // - --------------   case 3, test file  ----------------
 helpers = {};
 const JSONFile = path.resolve("test_output.json");

 lib(plop, { ...config.object, ...{ JSONFile }});

 fs.writeJSON( JSONFile, {'someArray': [], 'someObject': {}	},
   (err) => { // cb writeJSON
		// console.log('file writen');
	 	helpers['json-modify-file'](
		 	answers,
			(err) => { // cb json-modify-file
				//console.log('Helper is done');
				assert.equal("No errors to be returned", err, null);
				fs.readJSON(JSONFile, {},
					(err, json_content) => { // cb readJSON
						//console.log('Reading file from test');
						assert.equal("Expect file content to be changed", json_content, expected_obj);
						fs.remove(JSONFile, err=> {
							if (err) console.log("Can't remove %s testing file", JSONFile);
							assert.show();
						});
					});// readJSON
			}); //json-modify-file
	}); // write JSON
