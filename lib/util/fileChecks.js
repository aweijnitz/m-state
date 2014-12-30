var startsWith = function (token, str) {
    return str.slice(0, token.length) == token;
};

var isDefined = function(val) {
    return (val != undefined);
};

var isQuintuple = function (line) {
    if(!isDefined(line))
        return false;
    var pass0 = line.split(',').map(function(i) { return i.trim() });
    return (isDefined(pass0) && pass0.length == 5);
};

var isComment = function (line) {
    return (isDefined(line) && startsWith('#', line));
};


exports = module.exports.isQuintuple = isQuintuple;
exports = module.exports.isComment = isComment;
exports = module.exports.isDefined = isDefined;
