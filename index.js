"use strict";

var argv = require('minimist')(process.argv.slice(2));
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var babelify = require('babelify');
var sass = require('gulp-sass');
var _ = require('lodash');
var through = require('through2');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var gulpUtil = require('gulp-util');

var enabled = {
    // Enable minify,uglify when `--production`
    minifyUglify: argv.production
};

class Runner {

    constructor(src) {

        if(!_.isArray(src)) src = [src];

        this.src = _.map(src, (src)=>{
            return Bier.settings.source_prefix + src;
        });
        this.dist = null;
        this.concat_name = null;
        if (this.execute === undefined) {
            throw new TypeError("Must override method execute");
        }
    }

    to(dist) {
        this.dist = Bier.settings.dist_prefix + dist;
        return this;
    }

    concat(name) {
        this.concat_name = name;
        return this;
    }

    _shouldConcat() {
        return null !== this.concat_name;
    }

    _getConcatName() {
        return (this._shouldConcat()) ? this.concat_name : 'all.js';
    }
}

class BrowserifyRunner extends Runner {

    constructor(src) {
        super(src);
    }

    execute() {
        return gulp.src(this.src).pipe(through.obj((file, encoding, callback) => {
            browserify(BrowserifyRunner._getBrowserifyConfig(file.path)).bundle().pipe(source(file.relative)).pipe(gulp.dest(this.dist)).on('end', callback);
        }));
    }

    static _getBrowserifyConfig(entries) {
        return {
            entries: entries,
            //defining transforms here will avoid crashing your stream
            transform: [babelify.configure({ presets: ["es2015"] })]
        };
    }
}

class JsRunner extends Runner {

    constructor(src) {
        super(src);
    }

    execute() {
        return gulp.src(this.src)
            .pipe(gulpif(enabled.minifyUglify, uglify().on('error', gulpUtil.log)))
            .pipe(gulpif(this._shouldConcat(), concat(this._getConcatName())))
            .pipe(gulp.dest(this.dist));
    }

}

class SassRunner extends Runner {

    constructor(src) {
        super(src);
    }

    execute() {
        return gulp.src(this.src).pipe(sass().on('error', sass.logError))
            .pipe(gulpif(enabled.minifyUglify, minifyCss({
                compatibility: 'ie8'
            })))
            .pipe(gulp.dest(this.dist));
    }

}

class CopyRunner extends Runner {

    constructor(src) {
        super(src);
    }

    execute() {
        return gulp.src(this.src).pipe(gulp.dest(this.dist));
    }

}

var Bier = function ($closure) {
    var all = {};
    $closure.call(null, {
        sass: function (src) {
            var runner = new SassRunner(src);
            all.sass = all.sass || [];
            all.sass.push(runner);
            return runner;
        },
        copy: function (src) {
            var runner = new CopyRunner(src);
            all.copy = all.copy || [];
            all.copy.push(runner);
            return runner;
        },
        browserify: function (src) {
            var runner = new BrowserifyRunner(src);
            all.browserify = all.browserify || [];
            all.browserify.push(runner);
            return runner;
        },
        javascript: function (src) {
            var runner = new JsRunner(src);
            all.javascript = all.javascript || [];
            all.javascript.push(runner);
            return runner;
        }
    });
    var defaultTasks = [];
    var watchTasks = [];
    _.each(all, function (runners, key) {
        gulp.task('watch:' + key, function () {
            gulp.watch(_.flatten(_.map(runners, function (runner) {
                return runner.src;
            })), [key]);
        });
        gulp.task(key, function () {
            _.each(runners, function (runner) {
                runner.execute();
            });
        });
        defaultTasks.push(key);
        watchTasks.push('watch:' + key);
    });

    gulp.task('watch', watchTasks);
    gulp.task('default', defaultTasks);
};

Bier.settings = Bier.settings || {};
Bier.settings.dist_prefix = './';
Bier.settings.source_prefix = './';

module.exports = Bier;
