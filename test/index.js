
var rimraf = require('rimraf');
var assert = require('assert');
var exec = require('child_process').exec;
var fs = require('fs');

process.chdir(__dirname);

describe("Gulp Runner", function () {
	it("gulp sass", function (done) {
		rimraf('dist', function () {
			exec('../node_modules/.bin/gulp sass', function (err) {
				if (err) done(err);
				assert.equal(
					fs.readFileSync('expected/sass/index.css').toString(),
					fs.readFileSync('dist/sass/index.css').toString()
				);
				done();
			});
		});
	});

	it("gulp scss (alias sass)", function (done) {
		rimraf('dist', function () {
			exec('../node_modules/.bin/gulp scss', function (err) {
				if (err) done(err);
				assert.equal(
					fs.readFileSync('expected/scss/index.css').toString(),
					fs.readFileSync('dist/scss/index.css').toString()
				);
				done();
			});
		});
	});

	it("gulp less", function (done) {
		rimraf('dist', function () {
			exec('../node_modules/.bin/gulp less', function (err) {
				if (err) done(err);
				assert.equal(
					fs.readFileSync('expected/less/index.css').toString(),
					fs.readFileSync('dist/less/index.css').toString()
				);
				done();
			});
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
