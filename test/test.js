var join = require('..');
var fs = require('fs');
var assert = require('assert');
var root = __dirname + '/fixtures';
var s1 = fs.createReadStream(root + '/1.json');
var s2 = fs.createReadStream(root + '/2.json');
var s3 = fs.createReadStream(root + '/3.json');

var myjoin = join(function(chunk, enc, cb) {

  if (chunk.number > 50) {
    cb(null, chunk);
  }
  else {
    cb();
  }

});

var expected = [
  {"number":75,"color":"blue"},
  {"number":60,"color":"green"},
  {"number":85,"color":"blue"},
  {"number":85,"color":"blue"}
];

var results = [];

myjoin
  .on(s1, s2, s3)

  .on('data', function(data) {
    results.push(JSON.parse(data));
  })

  .on('end', function() {
    assert(expected.length, results.length);
    results.forEach(function(val, index) {
      assert(val.number, expected[index].number);
    });
  });

