Festiv Bier
===

[![Latest Version](https://img.shields.io/npm/v/bier.svg)](http://npmjs.com/bier)
[![Total Downloads](https://img.shields.io/npm/dt/bier.svg)](http://npmjs.com/bier)

The Bier is gulp task runner framework.

**Example**

open `gulpfile.js`, and write this.

```js
var bier = require('bier');

bier.config = {
    env: 'develop',
    build: {
        src_prefix: "frontend/",
        dist_prefix: "public/dist/",
    }
};

bier(function (will) {

    will.copy('bower_components/jquery/dist/*').to('jquery');

    will.sass('style/publ/**/*.scss').to('publ');
    will.sass(['style/admin/layout.scss', 'style/admin/login.scss']).to('admin/css');

	will.less('less/index.less').to('less');

    will.concat([
        'bower_components/bxslider-4/dist/jquery.bxslider.js',
        'bower_components/jquery.cookie/jquery.cookie.js',
        'script/main.js'
    ]).to('scripts/main.js');

    will.browserify(['script/admin/**/*.js']).to('admin/js');
});
```

and, run command `gulp` in your sh. 

If you want to watch all, just run `gulp watch`.

If you want minified output, just run `gulp --env=production`.

## Support Tasks

- copy
- sass
- scss (alias sass)
- less
- concat
- browserify : support **ecma script 2015**

## Run Test

```bash
$ npm test
```
