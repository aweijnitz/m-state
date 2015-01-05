var util = require("util");
var EventEmitter = require("events").EventEmitter;


var makeStateKey = function (stateName, symbol) {
    return stateName + '-' + symbol;
};

var decodeStateName = function (stateKey) {
    return stateKey.split('-')[0]
}

var matchState = function (stateName, symbol, stateMachine) {
    return stateMachine[makeStateKey(stateName, symbol)];
};

var keys = function(obj) {
    var keys = [];
    for (var name in obj)
        keys.push(name);

    return keys;
}

/**
 *  MachineRunner is a class that given a Turing Machine and an optional initial tape,
 *  will step through the state transitions until completion (or infinity).
 *
 *  MachineRunner is also an EventEmitter and will emit the following events
 *
 *  'step': Emitted for each 'tick' of the machine. Supplies the current state as argument.
 *  'halt': Emitted if the state machine enters the terminating 'H' (halt) state.
 *
 * @param stateMachine - the 'program' to run (i.e. state machine)
 * @param initialTape - Optional initial input arguments supplied on tape
 * @constructor
 */
var MachineRunner = function (stateMachine, initialTape) {
    // Setup event emitter
    EventEmitter.call(this);

    // Setup internal state
    this.tape = [0];
    this.head = 0;
    this.currentSymbol = this.tape[0];
    this.currentState = null;
    this.stateMachine = null;
    this.iterations = 0;
    if (stateMachine == undefined)
        throw new Error('stateMachine undefined');
    this.stateMachine = stateMachine;

    if (initialTape != undefined) {
        this.tape = initialTape;
        this.currentSymbol = this.tape[this.head];
    }
    this.currentState = decodeStateName(keys(stateMachine).sort()[0]); // get the name of the initial state
}

util.inherits(MachineRunner, EventEmitter);


MachineRunner.prototype.isHalted = function () {
    return 'H' == this.currentState;
};

/**
 * Single step the machine.
 * Fires the 'step' event.
 * @returns {{state: *, symbol: *, rule, iteration: number}}
 */
MachineRunner.prototype.step = function () {

    if(this.isHalted())
        return this.getState();

    // Read the tape
    this.currentSymbol = this.tape[this.head];
    if(this.currentSymbol == null || this.currentSymbol == undefined)
        this.currentSymbol = 0;

    // Match the state and symbol to an action
    var rule = matchState(this.currentState, this.currentSymbol, this.stateMachine);

    // Write tape according to the action
    this.tape[this.head] = rule[0];

    // Update head position
    if (rule[1] == 'R')
        this.head++;
    else if (rule[1] == 'L')
        this.head--;

    // Update the state
    this.currentState = rule[2];
    this.iterations++;

    var state = this.getState();
    this.emit('step', state);
    if(this.currentState == 'H') {
        this.emit('halt', state);
        debugger;
    }

    return state;
};


/**
 * Returns summary of current machine state.
 * @returns {{state: *, symbol: *, rule, iteration: number}}
 */
MachineRunner.prototype.getState = function () {
    return {
        state: this.currentState,
        isHalted: this.isHalted(),
        symbol: this.currentSymbol,
        rule: matchState(this.currentState, this.currentSymbol, this.stateMachine),
        iteration: this.iterations,
        head: this.head
    };
};


/**
 * Starts the evaluation and iterates until halt or for infinity.
 * Triggers the 'step' event and the 'halt' event, if the machine comes to halt.
 */
MachineRunner.prototype.run = function () {
    var state = this.step();
    while (state.state != 'H') {
        state = this.step();
    }
};


/**
 * Provides a mechanism for iterating over the current symbols on the tape.
 *
 */
MachineRunner.prototype.tapeIterator = function () {
    var tp = this.tape;
    var hd = 0;
    return {
        next: function() {
            if (!this.hasNext())
                return null;
            return tp[hd++];
        },
        hasNext: function() {
            return hd < tp.length;
        },
        rewind: function() {
            hd = 0;
            return tp[hd];
        },
        current: function() {
            return tp[hd];
        },
        each: function(callback) {
            tp.forEach(callback);
        }
    }
}

module.exports = MachineRunner;

