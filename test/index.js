
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

	it("gulp sass --env=production", function (done) {
		runGulpCommand('sass --env=production', function (err) {
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

	it("gulp scss --env=production", function (done) {
		runGulpCommand('scss --env=production', function (err) {
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

	it("gulp less --env=production", function (done) {
		runGulpCommand('less --env=production', function (err) {
			if (err) done(err);
			assertEqualFile('dist/less/index.css', 'expected/less/index.min.css');
			done();
		});
	});

	it("gulp browserify", function (done) {
		this.timeout(3000);
		runGulpCommand('browserify', function (err) {
			if (err) done(err);
			assertEqualFile('dist/browserify/index.js', 'expected/browserify/index.js');
			done();
		});
	});

	it("gulp browserify --env=production", function (done) {
		this.timeout(3000);
		runGulpCommand('browserify --env=production', function (err) {
			if (err) done(err);
			assertEqualFile('dist/browserify/index.js', 'expected/browserify/index.min.js');
			done();
		});
	});
});
