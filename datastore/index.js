const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// create new file in HD for each todo text
// name file based on unique id
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, counterString) => {
    var filePath = path.join(exports.dataDir, counterString + '.txt');
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error writing text file');
      } else {
        callback(null, { id: counterString, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, function (err, files) {
    if (err) {
      throw ('error writing text file');
    } else {
      var files = _.map(files, (id) => {
        return { id: id.slice(0, id.length - 4), text: id.slice(0, id.length - 4) };
      });
      callback(null, files);
    }
  });
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(filePath, function (err, fileData) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: fileData.toString() });
    }
  });
};

// finds file and changes text
exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.access(filePath, function (err) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw ('error writing text file');
        } else {
          callback(null, { id: id, text: text });
        }
      });
    }
  });
};

// finds file and removies
exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  })  
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
