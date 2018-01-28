const fs = require('fs');
const path = require('path');


function read_file(file_path) {
    return new Promise((done, fail) => {
        fs.readFile(file_path, 'utf8', (err, text) =>{
            if (err) {
                fail(err);
            } else {
                done ({
                    name: file_path,
                    content: text
                });
            }   
        });
    })
}

function read_files(base_path, files){
    return files.map(item => read_file(path.join(base_path, item)))
}

function read_dir (path){
    return new Promise((done, fail) => {
        fs.readdir(path, (err, files) => {
            if(err){
                fail(err);
            }
            else {
                Promise
                    .all(read_files(path, files))
                    .then(result => done(result))
                    .catch(err => fail(err));
            };
        })
    });
}        


module.exports = read_dir;