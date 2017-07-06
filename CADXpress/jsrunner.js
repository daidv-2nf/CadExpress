var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
var config = {
    source: "dist/public/js",
    dest: "dist/public/jsb"
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
            if (file.endsWith('.js')) {
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

var fls = readDirectory(config.source);
var fls_length = Object.size(fls);
for (var i = 0; i < fls_length; i++) {
    console.log('[jsrunner] Converting ' + fls[i][2]);
    browserify({ debug: true })
        .transform(babelify)
        .require(fls[i][2], { entry: true })
        .bundle()
        .on("error", function (err) { console.log("Error: " + err.message); })
        .pipe(fs.createWriteStream(mvFileName(fls[i][2], config.dest)));
}