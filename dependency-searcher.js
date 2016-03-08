
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function searchSass(sassFile) {

	var reImport = /@import\s+[\"']([^\"']*)[\"'];?/;

	// change components/hello -> components/_hello.sass
	function _changeImportNameToFileName(importName) {
		var fileBaseName = '_' + path.basename(importName) + '.sass';
		return path.dirname(importName) + '/' + fileBaseName;
	}

	function _search(fileNameToSearch, cb) {
		var baseSassPath = path.dirname(fileNameToSearch);
		fs.readFile(fileNameToSearch, function (err, data) {
			if (err) throw err;
			var contents = data.toString();
			var fileNames = [];
			var result;

			while ((result = reImport.exec(contents))) {
				var syntaxImport = result[0];
				var importName = result[1];
				fileNames.push(
					path.normalize(baseSassPath + '/' + _changeImportNameToFileName(importName))
				);
				contents = contents.replace(syntaxImport, '');
			}
			if (fileNames.length === 0) {
				cb();
				return;
			}
			var returnToFileNames = fileNames.slice();
			var iteratablePromises = [];

			// Promise.all()
			_.each(fileNames, function (fileName) {
				iteratablePromises.push(new Promise(function (resolve) {
					_search(fileName, function (findedFileNames) {
						if (findedFileNames) {
							returnToFileNames = _.concat(returnToFileNames, findedFileNames)
						}
						resolve();
					});
				}));
			});
			Promise.all(iteratablePromises).then(function () {
				cb(returnToFileNames);
			});
		});
	}

	return new Promise(function (resolve, reject) {
		_search(sassFile, function (dependencies) {
			resolve(dependencies);
		});
	});
}


module.exports = {
	sass: searchSass
};
