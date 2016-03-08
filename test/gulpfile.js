
var Bier = require('../index.js'); // bier

Bier.settings.dist_prefix = 'dist/';
Bier.settings.source_prefix = 'assets/';

Bier(function (will) {
	// run sass
	will.sass('sass/index.scss').to('sass');

	// run scss
	will.scss('scss/index.scss').to('scss');
});
