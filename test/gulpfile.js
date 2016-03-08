
var Bier = require('../index.js'); // bier

Bier.settings.dist_prefix = 'dist/';
Bier.settings.source_prefix = 'assets/';

Bier(function (will) {
	will.sass('sass/index.scss').to('sass');
});
