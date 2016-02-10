Festiv Bier
===

The Bier is gulp task runner framework.


**Example**

```js
var bier = require('bier');

bier.settings.dist_prefix = 'public/static/';

bier(function (do) {

    do.copy('bower_components/jquery/dist/*').to('jquery');

    do.sass('style/publ/**/*.scss').to('publ');
    do.sass(['style/admin/layout.scss', 'style/admin/login.scss']).to('admin/css');

    do.javascript([
        'bower_components/bxslider-4/dist/jquery.bxslider.js',
        'bower_components/jquery.cookie/jquery.cookie.js',
        'script/main.js'
    ]).to('scripts').concat('main.js');

    do.browserify(['script/admin/**/*.js']).to('admin/js');
});
```

## Support Tasks

- copy
- sass
- javascript
- browserify
