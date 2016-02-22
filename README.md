Festiv Bier
===

[![Latest Version](https://img.shields.io/npm/v/bier.svg)](http://npmjs.com/bier)
[![Total Downloads](https://img.shields.io/npm/dt/bier.svg)](http://npmjs.com/bier)

The Bier is gulp task runner framework.

**Example**

```js
var bier = require('bier');

bier.settings.dist_prefix = 'public/static/';

bier(function (I) {

    I.copy('bower_components/jquery/dist/*').to('jquery');

    I.sass('style/publ/**/*.scss').to('publ');
    I.sass(['style/admin/layout.scss', 'style/admin/login.scss']).to('admin/css');

    I.javascript([
        'bower_components/bxslider-4/dist/jquery.bxslider.js',
        'bower_components/jquery.cookie/jquery.cookie.js',
        'script/main.js'
    ]).to('scripts').concat('main.js');

    I.browserify(['script/admin/**/*.js']).to('admin/js');
});
```

## Support Tasks

- copy
- sass
- javascript
- browserify
