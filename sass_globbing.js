'use strict';

let slash = require('slash'),
    path = require('path'),
    through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    File = gutil.File;

module.exports = function(file, options) {
    if (!file) {
        throw new PluginError('gulp-sass-globbing', 'Missing file option.');
    }

    options = options || {};

    let defaults = {
        useSingleQuotes: false,
        signature: '/* generated with gulp-sass-globbing */'
    };
    if (!("useSingleQuotes" in options)) {
        options.useSingleQuotes = defaults.useSingleQuotes;
    }
    if (!("signature" in options)) {
        options.signature = defaults.signature;
    }

    if (options.signature === false) {
        options.signature = '';
    }

    let quoteSymbol = '"';

    if (typeof options.useSingleQuotes !== 'undefined' && options.useSingleQuotes === true) {
        quoteSymbol = '\'';
    }

    let imports = '',
        bufferContents = (file, encoding, callback) => {
            if (file.isNull()) {
                return callback(null, file);
            }

            if (file.isStream()) {
                this.emit('error', new PluginError('gulp-sass-globbing', 'Streams not supported.'));
            }
            else if (file.isBuffer()) {
                let ext = path.extname(file.path);
                if (ext.toLowerCase() == '.scss' || ext.toLowerCase() == '.sass') {
                    let filename = path.normalize(file.path),
                        cwd = path.resolve(path.normalize(file.cwd)),
                        cwdfile = (filename.substr(filename.search(cwd))).replace(cwd, ''),
                        importname = (cwdfile.replace(/\.(scss|sass)$/, '')).replace('/_', '/');

                    if (importname.charAt(0) === '/') {
                        importname = importname.substr(1);
                    }
                    imports = imports + '@import ' + quoteSymbol + slash(importname) + quoteSymbol + ';\n';
                }

                callback();
            }
        },

        endStream = function(callback) {
            let globFile = new File(file);
            let filecontents = options.signature;

            if (typeof options.signature === 'string' && options.signature !== '') {
                if (imports === '') {
                    filecontents = filecontents + '\n';
                }
                else {
                    filecontents = filecontents + '\n\n' + imports;
                }
            }

            if (filecontents === '') {
                filecontents = '\n';
            }

            globFile.contents = new Buffer(filecontents);

            this.push(globFile);
            callback();
        };

    return through.obj(bufferContents, endStream);
};