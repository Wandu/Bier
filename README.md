Festiv Bier
===

The Bier is gulp task runner framework.


**Example**

```js
var bier = require('bier');

var BOWER_PATH = 'bower_components';

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
