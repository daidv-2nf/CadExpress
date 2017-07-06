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
    dest: "dist"
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
//src/public/js/lib/base.ts -> dest
//dest/public/js/lib/base.js -> dest/public/jsb
function mvFileName(filePath, path) {
    filePathArr = filePath.split('/');
    pathArr = path.split('/');
    var lastEqual = 0;
    var completePath = path;
    for (var i = 0; i < filePathArr.length; i++) {
        if (pathArr.length <= i || (pathArr.length > i && filePathArr[i] != pathArr[i])) {
            if (lastEqual + 1 < i) {
                completePath += '/' + filePathArr[i];
                if (i + 1 < filePathArr.length) {   
                    if (!fs.existsSync(completePath)) {
                        fs.mkdirSync(completePath, 0777);
                    }
                }
            } else if(i == 0) {
                lastEqual = -1;
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

function getFileNameInExt(file, ext) {
    return file.substr(0, file.lastIndexOf('.')) + '.' + ext;
}

function convertFiles(file) {
    if (file == null) {
        var fls = readDirectory(config.source);
        var fls_length = Object.size(fls);
        for (var i = 0; i < fls_length; i++) {
            console.log('[jsrunner] Converting ' + fls[i][2]);
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
            .pipe(source(getFileNameInExt(mvFileName(fls[i][2], config.dest),'js')))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest("."));
        }
    } else {
            console.log('[jsrunner] Converting... ' + file);
            browserify({
                basedir: '.',
                debug: true,
                entries: [file],
                cache: {},
                packageCache: {}
            })
            .plugin(tsify)
            .transform('babelify', {
                presets: ['es2015'],
                extensions: ['.ts']
            })
            .bundle()
            .pipe(source(getFileNameInExt(mvFileName(file, config.dest),'js')))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest("."));
    }
}

gulp.task("convert", function () {
    return convertFiles(null);
});

gulp.task("copy_asset", function () {
    var shell = require('shelljs');

    shell.cp('-R', 'src/public/js/lib/*.js', 'dist/public/js/lib');
    shell.cp('-R', 'src/public/fonts', 'dist/public');
    shell.cp('-R', 'src/public/images', 'dist/public');
    shell.cp('-R', 'src/public/languages', 'dist/public');
    return true;
});

gulp.task("watch", function () {
    watch(config.source + '/**/*.ts').on('change', function(file) {
        console.log('[jsrunner] Converting... ' + file.path);
        convertFiles(file.path);
    });
    return true;
});

gulp.task("default",["convert", "copy_asset", "watch"], function() {
    return true;
});