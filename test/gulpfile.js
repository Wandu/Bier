
var Bier = require('../index.js'); // bier

Bier.config = {
	build: {
		src_prefix: "assets/",
		dist_prefix: "dist/",
	}
};

Bier(function (will) {
	// run sass
	will.sass('sass/index.scss').to('sass');

	// run scss
	will.scss('scss/index.scss').to('scss');

	// run less
	will.less('less/index.less').to('less');

	// run less
	will.browserify('browserify/index.js').to('browserify');

	// run less
	will.concat('concat/*.js').to('concat');

	will.concat([
		'concat/index1.js',
		'concat/index2.js',
	]).to('concat', 'common.js');
});
