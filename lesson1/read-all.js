const fs = require('fs');
const file = require('./file-promise');
const path = require('path');

function readfiles(base_path, files){
    var file_array = new Array(); 
    for (let i = 0; i < files.length; i++) {
        file_array.push(
            file
                .read(path.join(base_path, files[i]))
                .then(text => {
                    var obj = {
                        name: files[i],
                        content: text
                    };
                    return obj;
                }));
    }
    return file_array;
}

function read_dir (path){
    return new Promise((done, fail) => {
        fs.readdir(path, (err, files) => {
            if(err){
                fail(err);
            }
            else {
                Promise
                    .all(readfiles(path, files))
                    .then(result => done(result))
                    .catch(err => fail(err));
            };
        })
    });
}        


module.exports = read_dir;