var fs = require("fs");
var gulp = require("gulp");
var watch  = require("gulp-watch");
var browserify = require("browserify");
var tsify = require("tsify");
// var tsProject = ts.createProject("tsconfig.json");
var babelify = require("babelify");
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');

var config = {
    source: "src/public/js",
    dest: "dist/public/js-build"
};

if (!fs.existsSync(config.dest)) {
    fs.mkdirSync(config.dest, 0777);
}
Object.size = function (a) {
    var count = 0;
    var i;
    for (i in a) {
        if (a.hasOwnProperty(i)) {
            count++;
        }
    }
    return count;
}
function readDirectory(path) {
    var files = {};
    var file_index = 0;
    fs.readdirSync(path).forEach(file => {
        var fullpath = path + '/' + file;
        var stats = fs.statSync(fullpath);
        if (stats.isDirectory()) {
            var fis = readDirectory(fullpath);
            var fis_length = Object.size(fis);
            for (var i = 0; i < fis_length; i++) {
                files[file_index] = fis[i];
                file_index++;
            }
        } else {
            if (file.endsWith('.ts')) {
                files[file_index] = [file, path, fullpath];
                file_index++;
            }
        }
    });
    return files;
}

function isEmptyDirectory(path) {
    var files = fs.readdirSync(path);
    if (files.length == 0) {
        return true;
    } else {
        return false;
    }
}
function mvFileName(filePath, path) {
    filePathArr = filePath.split('/');
    pathArr = path.split('/');
    var lastEqual = 0;
    var completePath = path;
    for (var i = 0; i < filePathArr.length; i++) {
        if (filePathArr[i] != pathArr[i]) {
            if (lastEqual + 1 < i) {
                completePath += '/' + filePathArr[i];
                if (i + 1 < filePathArr.length) {
                    if (!fs.existsSync(completePath)) {
                        fs.mkdirSync(completePath, 0777);
                    }
                }
            }
        } else {
            lastEqual = i;
        }
    }
    return completePath;
}
function getDirectory(file) {
    return file.substr(0, file.lastIndexOf('/'));
}

function convertFiles(file) {
    if (file == null) {
        var fls = readDirectory(config.source);
        var fls_length = Object.size(fls);
        for (var i = 0; i < fls_length; i++) {
            console.log('[jsrunner] Converting ' + fls[i][2]);
            // browserify({ debug: false })
            //     .transform(babelify)
            //     .require(fls[i][2], { entry: true })
            //     .bundle()
            //     .on("error", function (err) { console.log("Error: " + err.message); })
            //     .pipe(source('bundle.js'))
            //     .pipe(buffer())
            //     .pipe(sourcemaps.init({loadMaps: true}))
            //     .pipe(uglify())
            //     .pipe(sourcemaps.write('./'))
            //     .pipe(fs.createWriteStream(mvFileName(fls[i][2], config.dest)));

            // browserify({
            //     basedir: '.',
            //     debug: true,
            //     entries: [fls[i][2]],
            //     cache: {},
            //     packageCache: {}
            // })
            // .plugin(tsify)
            // .transform('babelify', {
            //     presets: ['es2015'],
            //     extensions: ['.ts']
            // })
            // .bundle()
            // .pipe(source(mvFileName(fls[i][2], config.dest)))
            // .pipe(buffer())
            // .pipe(sourcemaps.init({loadMaps: true}))
            // .pipe(uglify())
            // .pipe(sourcemaps.write(getDirectory(mvFileName(fls[i][2], config.dest))))
            // .pipe(gulp.dest('public/js-build'));

             browserify({
                basedir: '.',
                debug: true,
                entries: [fls[i][2]],
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .transform('babelify', {
                presets: ['es2015'],
                extensions: ['.ts']
            })
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest("dist"));
        }
    } else {
            console.log('[jsrunner] Converting... ' + file);
            browserify({ debug: false })
                .transform(babelify)
                .require(file, { entry: true })
                .bundle()
                .on("error", function (err) { console.log("Error: " + err.message); })
                .pipe(fs.createWriteStream(mvFileName(file, config.dest)));
    }
}

gulp.task("convert", function () {
    return convertFiles(null);
});

gulp.task("watch", function () {
    watch(config.source + '/**/*.js').on('change', function(file) {
        console.log('[jsrunner] Converting... ' + file.path);
        convertFiles(file.path);
    });
    return true;
});

gulp.task("default",["convert", "watch"], function() {
    return true;
});