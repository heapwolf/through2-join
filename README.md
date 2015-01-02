# SYNOPSIS
Produce a stream of intersecting data of two or more delimited json streams.

# EXAMPLE
```js
var join = require('through2-join');
var fs = require('fs');

var s1 = fs.createReadStream('./1.json');
var s2 = fs.createReadStream('./2.json');
var s3 = fs.createReadStream('./3.json');

join(function(chunk, enc, cb) {

  if (chunk.number > 50) {
    cb(null, chunk);
  }
  else {
    cb();
  }

}).on(s1, s2, s3).pipe(process.stdout);
```

Without a through transform might be useful too.
```js
join().on(s1, s2, s3).pipe(process.stdout);
```

