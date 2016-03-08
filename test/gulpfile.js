
var Bier = require('../index.js'); // bier

Bier.config.dist_prefix = 'dist/';
Bier.config.source_prefix = 'assets/';

Bier(function (will) {
	// run sass
	will.sass('sass/index.scss').to('sass');

	// run scss
	will.scss('scss/index.scss').to('scss');

	// run less
	will.less('less/index.less').to('less');
});
