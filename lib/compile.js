var util = require('util');

var compileState = function (stateDescriptionArray, stateMachine) {
    if(stateDescriptionArray.length < 5)
        throw new Error("Invalid quintuple: " + util.inspect(stateDescriptionArray));

    var key = stateDescriptionArray[0]+'-'+stateDescriptionArray[1];
    var val = stateDescriptionArray.slice(2);
    stateMachine[key] = val;
    return stateMachine;
}

var compileAll = function(machineStatesArray) {
    var stateMachine = {};
    machineStatesArray.map(function(entry) {
        stateMachine = compileState(entry, stateMachine);
    });
    return stateMachine;
};

exports = module.exports.compileState = compileState;
exports = module.exports.compileAll = compileAll;
