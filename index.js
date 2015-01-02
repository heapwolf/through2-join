var through = require('through2').obj;
var JSONStream = require('JSONStream');

module.exports = function(opts, transform) {

  if (typeof opts == 'function') {
    transform = opts;
    opts = {};
  }

  var matches = [];
  var sout = through();
  var sin = through();

  var t = through(function(chunk, enc, callback) {
    transform(chunk, enc, function(err, value) {
      !err && value && matches.push(value);
      callback(err);
    });
  });

  return { 
    on: function on(streams) {

      if (!Array.isArray(arguments[0])) {
        streams = [].slice.call(arguments);
        last = streams.pop();
      }

      if (transform) {
        sin.pipe(JSONStream.parse(opts)).pipe(t);
    
        transform && sin.on('end', function() {
          matches.forEach(function(match, index) {
            sout.write(JSON.stringify(match) + '\n');
            if (index == matches.length -1) sout.end();
          });
        });
      }
      else {
        sin.pipe(sout);
      }

      (function next(i) {
        var julian = streams[i];
        if (!julian) return sin.push(null);
        julian.pipe(sin, { end: false });
        julian.on('error', function(err) {
          t.emit('error', err);
        });
        julian.on('end', function() {
          next(i + 1);
        });
      })(0);

      return sout;
    }
  };
};

