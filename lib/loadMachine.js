var path = require('path');
var LineByLineReader = require('line-by-line');
var Q = require('Q');

var checks = require('./util/fileChecks.js');
var compiler = require('./compile.js');

var debugPrint = function (line, lineNr) {
    console.log(lineNr + ':\t' + line);
    console.log('isComment:\t' + checks.isComment(line));
    console.log('isQuintuple:\t' + checks.isQuintuple(line));
};


var splitAndTrim = function (line) {
    if (line == undefined)
        return [];
    return line.split(',').map(function (i) {
        return i.replace('(', '').replace(')', '').trim()
    });
}


var parse = function (line, lineNr) {
    if (line != undefined && !checks.isComment(line) && checks.isQuintuple(line))
        return splitAndTrim(line);
    else if (line != undefined && !checks.isComment(line) && !checks.isQuintuple(line))
        throw new Error('Syntax error at line ' + lineNr);
    return [];
};


var compile = function (machineStatesArray) {
    return compiler.compileAll(machineStatesArray);
};

var parseFile = function (fileName) {
    var deferred = Q.defer();
    var states = [];
    var currentLine = 0;

    var lr = new LineByLineReader(path.resolve(fileName), {
        encoding: 'utf8',
        skipEmptyLines: true
    });

    lr.on('line', function (line) {
        try {
            var res = parse(line, ++currentLine);
            if (res.length == 5) states.push(res);
        } catch (err) {
            lr.pause();
            lr.close();
            deferred.reject(err);
        }
    });

    lr.on('end', function () {
        try {
            deferred.resolve(compile(states));
        } catch (err) {
            deferred.reject(err);
        }
    });

    lr.on('error', function (err) {
        lr.close();
        deferred.reject(err);
    });

    return deferred.promise;
};

exports = module.exports.parseFile = parseFile;
exports = module.exports.splitAndTrim = splitAndTrim;

