var should = require('should');

var checks = require('../lib/util/fileChecks.js');

describe('File format helpers', function () {

    it('Should recognize "#" as a comment line', function () {
            checks.isComment('# this is a comment').should.be.true;
    });

    it('Should recognize !"#" non-comments', function () {
        checks.isComment('This is not a comment').should.be.false;
    });


    it('Should recognize quintuples', function () {
        checks.isQuintuple('a,b,c,d,e').should.be.true;
        checks.isQuintuple('a, b, c, d, e').should.be.true;
        checks.isQuintuple(' a,b, c, d,e ').should.be.true;
    });

    it('Should recognize false quintuples', function () {
        checks.isQuintuple('a,b, c, d').should.be.false;
    });

});