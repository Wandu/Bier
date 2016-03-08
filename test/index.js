
var rimraf = require('rimraf');
var assert = require('assert');
var exec = require('child_process').exec;
var fs = require('fs');

process.chdir(__dirname);

function runGulpCommand(command, callback) {
	rimraf('dist', function () {
		exec('../node_modules/.bin/gulp ' + command, callback);
	});	
}
function assertEqualFile(output, expected) {
	assert.equal(
		fs.readFileSync(expected).toString(),
		fs.readFileSync(output).toString()
	);
}

describe("Gulp Runner", function () {
	it("gulp sass", function (done) {
		runGulpCommand('sass', function (err) {
			if (err) done(err);
			assertEqualFile('dist/sass/index.css', 'expected/sass/index.css');
			done();			
		});
	});

	it("gulp sass --production", function (done) {
		runGulpCommand('sass --production', function (err) {
			if (err) done(err);
			assertEqualFile('dist/sass/index.css', 'expected/sass/index.min.css');
			done();			
		});
	});

	it("gulp scss (alias sass)", function (done) {
		runGulpCommand('scss', function (err) {
			if (err) done(err);
			assertEqualFile('dist/scss/index.css', 'expected/scss/index.css');
			done();			
		});
	});

	it("gulp scss --production", function (done) {
		runGulpCommand('scss --production', function (err) {
			if (err) done(err);
			assertEqualFile('dist/scss/index.css', 'expected/scss/index.min.css');
			done();			
		});
	});

	it("gulp less", function (done) {
		runGulpCommand('less', function (err) {
			if (err) done(err);
			assertEqualFile('dist/less/index.css', 'expected/less/index.css');
			done();			
		});
	});

	it("gulp less --production", function (done) {
		runGulpCommand('less --production', function (err) {
			if (err) done(err);
			assertEqualFile('dist/less/index.css', 'expected/less/index.min.css');
			done();			
		});
	});
});

describe("Dependency Searcher", function () {
	var searcher = require('../dependency-searcher');
	it("track sass files", function (done) {
		searcher.sass(__dirname + "/assets/sass/index.scss").then(function (deps) {
			assert.deepEqual([
				__dirname + '/assets/sass/components/_body.scss',
				__dirname + '/assets/sass/components/_section.scss',
				__dirname + '/assets/sass/components/_html.scss'
			], deps);
			done();
		}).catch(function (e) {
			done(e);
		});
	});
});
