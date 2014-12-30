var should = require('should');

var lm = require('../lib/loadMachine.js');
var compile = require('../lib/compile.js');

describe('Compiler', function () {

    it('Should compile valid state description', function () {
        var testState = lm.splitAndTrim('A,0,1,R,B');
        var stateMachine = compile.compileState(testState, {});
        stateMachine.should.have.property('A-0').with.lengthOf(3);
    });

    it('Should throw error for invalid state description', function () {
        (function() { compile.compileState([1,2,3,4], {}) }).should.throwError(/^Invalid/);
    });


    it('Should compile array of valid state descriptions', function () {
        var testState0 = lm.splitAndTrim('A,0,1,R,B');
        var testState1 = lm.splitAndTrim('A,1,1,L,B');
        var testState2 = lm.splitAndTrim('B,1,1,L,A');
        var testArray = [testState0, testState1, testState2];
        var stateMachine = compile.compileAll(testArray);
        stateMachine.should.have.property('A-0').with.lengthOf(3);
        stateMachine.should.have.property('A-1').with.lengthOf(3);
        stateMachine.should.have.property('B-1').with.lengthOf(3);
    });



});