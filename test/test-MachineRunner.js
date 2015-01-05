var should = require('should');

var Runner = require('../lib/MachineRunner.js');


describe('MachineRunner', function () {
    // Busy Beaver
    var busyB = {
        'A-0': ['1', 'R', 'B'],
        'A-1': ['1', 'L', 'C'],
        'B-0': ['1', 'L', 'A'],
        'B-1': ['1', 'R', 'B'],
        'C-0': ['1', 'L', 'B'],
        'C-1': ['1', 'N', 'H']
    };

    var takeTwo = {
        'A-0': ['1', 'R', 'B'],
        'A-1': ['1', 'R', 'B'],
        'B-0': ['1', 'N', 'H'],
        'B-1': ['1', 'N', 'H']
    };


    it('Should update status after a single step', function () {
        var r = new Runner(busyB);
        (r.getState().iteration).should.equal(0);
        r.step();
        (r.getState().iteration).should.equal(1);
    });

    it('Should fire "step" event for a single step', function (done) {
        var r = new Runner(busyB);
        r.on('step', function (status) {
            (status.iteration).should.equal(1);
            done();
        });
        r.step();
    });

    it('Should fire "halt" event after completion', function (done) {
        var r = new Runner(takeTwo);
        r.on('halt', function (status) {
            (status.state).should.equal('H');
            (status.isHalted).should.be.true;
            done();
        });
        r.run();
    });

    it('Should allow iteration of all tape symbols', function () {
        var r = new Runner(takeTwo);
        r.run();
        var nrSymbols = 0;
        var iter = r.tapeIterator();
        while(iter.next() != null) { nrSymbols++; };
        (nrSymbols).should.equal(2);
    });

    it('Should allow iteration of all tape symbols using each', function () {
        var r = new Runner(takeTwo);
        r.run();
        var nrSymbols = 0;
        var concat = '';
        var iter = r.tapeIterator();
        iter.each(function(item) {
            concat += item;
            nrSymbols++;
        });
        (nrSymbols).should.equal(2);
        (concat).should.equal('11');
    });


});