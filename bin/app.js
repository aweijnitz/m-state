var loader = require('../lib/loadMachine.js');
var argv = require('minimist')(process.argv.slice(2));

if (argv._.length < 1) {
    console.log('Usage: node app.js <state machine file>');
    process.exit(1);
}

loader(argv._[0])
    .then(function (ok) {
        console.log(ok)
    }).fail(function (err) {
        console.log(err.message + ', '+argv._[0]);
    });