
var assert = require('assert');

describe("sass", function () {
	it("do sass build", function () {
	});
});

describe("dependency-searcher", function () {
	var searcher = require('../dependency-searcher');
	it("track sass files", function (done) {
		searcher.sass(__dirname + "/assets/sass/index.sass").then(function (deps) {
			assert.deepEqual([
				__dirname + '/assets/sass/components/_body.sass',
				__dirname + '/assets/sass/components/_section.sass',
				__dirname + '/assets/sass/components/_html.sass'
			], deps);
			done();
		}).catch(function (e) {
			done(e);
		});
	});
});
