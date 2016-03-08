Festiv Bier
===

[![Latest Version](https://img.shields.io/npm/v/bier.svg)](http://npmjs.com/bier)
[![Total Downloads](https://img.shields.io/npm/dt/bier.svg)](http://npmjs.com/bier)

The Bier is gulp task runner framework.

**Example**

```js
var bier = require('bier');

bier.settings.dist_prefix = 'public/static/';

bier(function (will) {

    will.copy('bower_components/jquery/dist/*').to('jquery');

    will.sass('style/publ/**/*.scss').to('publ');
    will.sass(['style/admin/layout.scss', 'style/admin/login.scss']).to('admin/css');

    will.javascript([
        'bower_components/bxslider-4/dist/jquery.bxslider.js',
        'bower_components/jquery.cookie/jquery.cookie.js',
        'script/main.js'
    ]).to('scripts').concat('main.js');

    will.browserify(['script/admin/**/*.js']).to('admin/js');
});
```

## Support Tasks

- copy
- sass
- javascript
- browserify

## Run Test

```bash
$ npm test
```
