var util = require('util');
var path = require('path');
var fs = require('fs');
var packingGlob = require('packing-glob');
var mkdirp = require('mkdirp');

function MoveWebpackPlugin(patterns, when) {
  this.patterns = util.isArray(patterns) ? patterns : [patterns];
  this.when = when || 'beforeRun';
}

MoveWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;
  var options = this.options;

  if (this.when === 'beforeRun') {
    if (compiler.hooks) {
      compiler.hooks.beforeRun.tapAsync(this.constructor.name, function(compiler, callback) {
        self.doMove();
        callback();
      });
    } else {
      compiler.plugin('beforeRun', function(compiler, callback) {
        self.doMove();
        callback();
      });
    }
  } else {
    if (compiler.hooks) {
      compiler.hooks.done.tap(this.constructor.name, function() {
        self.doMove();
      });
    } else {
      compiler.plugin('done', function() {
        self.doMove();
      });
    }
  }
};

MoveWebpackPlugin.prototype.doMove = function() {
  this.patterns.forEach(function(pattern) {
    var cwd = pattern.cwd ? (path.isAbsolute(pattern.cwd) ? pattern.cwd : path.resolve(process.cwd(), pattern.cwd)) : process.cwd();
    var src = pattern.src;
    var dest = path.isAbsolute(pattern.dest) ? pattern.dest : path.resolve(process.cwd(), pattern.dest);

    packingGlob(src, pattern.options).forEach(function(item) {
      var file = path.join(cwd, item);
      var destDir = path.join(dest, path.dirname(item))
      var destFile = path.join(destDir, path.basename(item));
      if (!fs.existsSync(destDir)) {
        mkdirp.sync(destDir);
      }
      fs.renameSync(file, destFile);
    });
  });
};

module.exports = MoveWebpackPlugin;
