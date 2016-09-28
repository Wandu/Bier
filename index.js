
// for node v5.x
"use strict";

var _ = require('lodash');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var sass = require('gulp-sass');
var less = require('gulp-less');
var through = require('through2');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var buffer = require('vinyl-buffer');
var gulpUtil = require('gulp-util');
var childProcess = require('child_process');
var argv = require('minimist')(process.argv.slice(2));
delete argv._;

class Runner {

    constructor(src) {
        if(!_.isArray(src)) src = [src];
        this.src = _.map(src, src => _.get(Bier.config, 'build.src_prefix') + src);
        this.dist = null;
        this.watching = [_.get(Bier.config, 'build.src_prefix') + '**/*'];
        if (this.execute === undefined) {
            throw new TypeError("Must override method execute");
        }
    }
    watch(src) {
        if(!_.isArray(src)) src = [src];
        this.watching = _.map(src, src => _.get(Bier.config, 'build.src_prefix') + src);
    }
    to(dist) {
        this.dist = _.get(Bier.config, 'build.dist_prefix') + dist;
        return this;
    }
}

class BrowserifyRunner extends Runner
{
    constructor(src) {
        super(src);
        this.watching = [_.get(Bier.config, 'build.src_prefix') + '**/*.js'];
    }
    execute() {
        return gulp.src(this.src)
            .pipe(through.obj((file, encoding, callback) => {
                browserify(BrowserifyRunner._getBrowserifyConfig(file.path))
                    .bundle()
                    .pipe(source(file.relative))
                    .pipe(buffer())
                    .pipe(gulpif(_.get(Bier.config, 'env') === 'production', uglify().on('error', gulpUtil.log)))
                    .pipe(gulp.dest(this.dist))
                    .on('end', callback);
            }));
    }

    static _getBrowserifyConfig(entries) {
        return {
            entries: entries,

            //defining transforms here will avoid crashing your stream
            transform: [
                babelify.configure(_.get(Bier.config, 'babelify', {}))
            ]
        };
    }
}

class SassRunner extends Runner
{
    constructor(src) {
        super(src);
        this.watching = [_.get(Bier.config, 'build.src_prefix') + '**/*.scss'];
    }

    execute() {
        return gulp.src(this.src).pipe(sass().on('error', sass.logError))
            .pipe(gulpif(_.get(Bier.config, 'env') === 'production', cssnano()))
            .pipe(gulp.dest(this.dist));
    }
}

class LessRunner extends Runner
{
    constructor(src) {
        super(src);
        this.watching = [_.get(Bier.config, 'build.src_prefix') + '**/*.less'];
    }

    execute() {
        return gulp.src(this.src).pipe(less().on('error', sass.logError))
            .pipe(gulpif(_.get(Bier.config, 'env') === 'production', cssnano()))
            .pipe(gulp.dest(this.dist));
    }
}

class CopyRunner extends Runner
{
    constructor(src) {
        super(src);
        this.watching = this.src;
    }

    execute() {
        return gulp.src(this.src).pipe(gulp.dest(this.dist));
    }
}

class ConcatRunner extends Runner
{
    constructor(src) {
        super(src);
        this.watching = this.src;
    }

    to(dist, fileName) {
        this.dist = _.get(Bier.config, 'build.dist_prefix') + dist;
        this.fileName = fileName;
        return this;
    }

    execute() {
        return gulp.src(this.src)
            .pipe(gulpif(_.get(Bier.config, 'env') === 'production', uglify().on('error', gulpUtil.log)))
            .pipe(concat(this.fileName || 'all.js'))
            .pipe(gulp.dest(this.dist));
    }
}

function Bier(handler)
{
    Bier.config = _.defaultsDeep(argv, Bier.config, {
        env: "develop", // develop / production
        build: {
            src_prefix: "./",
            dist_prefix: "./",
        },
        babelify: {
            presets: ["es2015"],
            plugins: [],
        }
    });
    
    var all = {};
    
    handler.call(null, {
        sass: function (src) {
            var runner = new SassRunner(src);
            all.sass = all.sass || [];
            all.sass.push(runner);
            return runner;
        },
        scss: function (src) {
            var runner = new SassRunner(src);
            all.scss = all.scss || [];
            all.scss.push(runner);
            return runner;
        },
        less: function (src) {
            var runner = new LessRunner(src);
            all.less = all.less || [];
            all.less.push(runner);
            return runner;
        },
        copy: function (src) {
            var runner = new CopyRunner(src);
            all.copy = all.copy || [];
            all.copy.push(runner);
            return runner;
        },
        concat: function (src) {
            var runner = new ConcatRunner(src);
            all.concat = all.concat || [];
            all.concat.push(runner);
            return runner;
        },
        browserify: function (src) {
            var runner = new BrowserifyRunner(src);
            all.browserify = all.browserify || [];
            all.browserify.push(runner);
            return runner;
        },
    });
    var defaultTasks = [];
    var watchTasks = [];
    _.each(all, function (runners, key) {
        gulp.task('watch:' + key, function () {
            gulp.watch(_.flatten(_.map(runners, function (runner) {
                return runner.watching;
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

    gulp.task('watch', function () {
        var spawn = childProcess.spawn;
        var isReloadByGulpfile = false;
        var p;

        gulp.watch('gulpfile.js', function () {
            isReloadByGulpfile = true;
            if (p) p.kill();
        });
        spawnChildren();

        function spawnChildren() {
            // kill previous spawned childProcess
            if (p) {
                p.kill();
            }

            var processArgv = process.argv.slice(2);
            processArgv[0] = 'autoload-gulpfile';

            // `spawn` a child `gulp` childProcess linked to the parent `stdio`
            p = spawn('gulp', processArgv, {stdio: 'inherit'});
            p.on('close', function() {
                if (isReloadByGulpfile) {
                    console.warn("gulpfile.js is changed!");
                    isReloadByGulpfile = false;
                    setTimeout(spawnChildren, 0);
                } else {
                    console.warn("child process gone.. reload in 3 seconds..");
                    setTimeout(spawnChildren, 3000);
                }
            });
        }
    });
    gulp.task('default', defaultTasks);
    gulp.task('autoload-gulpfile', defaultTasks.concat(watchTasks));
}

Bier.config = {};
Bier.loadPhpConfig = function (fileName) {
    var stream = childProcess.execSync('php -r \'echo json_encode(require("' + fileName + '"));\'');
    return JSON.parse(stream);
};

module.exports = Bier;
