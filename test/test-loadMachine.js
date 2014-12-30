var should = require('should');
//var Q = require('Q');

var lm = require('../lib/loadMachine.js');

describe('File loader', function () {


    it('Should normalize quintuple lines with parenthesis', function () {
        var a = lm.splitAndTrim('a0, b, c, d, e');
        a[0].should.equal('a0');
        a[1].should.equal('b');
        a[2].should.equal('c');
        a[3].should.equal('d');
        a[4].should.equal('e');
    });


    it('Should parse and compile a state table file', function (done) {
        lm.parseFile('./test/data/busy-beaver.state-table')
            .then(function( ok ) {
                ok.should.have.property('A-0').with.lengthOf(3);
                done();
            }).fail( function (err) {
                throw new Error("Test failed! err: " + err.message);
            }).done();
    });


    it('Should reject a broken state table file', function (done) {
        lm.parseFile('./test/data/broken.file')
            .then(function( ok ) {
                throw new Error("Test failed!");
            }).fail( function (err) {
                err.message.should.equal('Syntax error at line 3');
                done();
            }).done();
    });


});