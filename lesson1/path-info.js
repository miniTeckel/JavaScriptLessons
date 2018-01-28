const fs = require('fs');

function file_info_dir(path, callback){
    fs.readdir(path, (err, files) => {
        if(err){
            callback(err, null);
        } else {
            var info ={
                path: path,
                type: 'directory',
                childs: files // BTW: there is no such word "childs"
            };
            callback(null, info);
        }
    });
}

function file_info_file(path, callback){
    fs.readFile(path, 'utf8', (err, content) => {
        if(err){
            callback(err, null);
        } else {
            var info ={
                path: path,
                type: 'file',
                content: content
            };
            callback(null, info);
        }
    });
}

function files_info(path, callback){
    
    fs.stat(path, (error, stats) =>{
        if (error) {
            callback(error, null);
        } else {
            if (stats.isDirectory()){
                file_info_dir(path, callback);
            }else if (stats.isFile()){
                file_info_file(path, callback);
            } else {
                callback(null, {type: undefined})
            }
        }   
    });
}

module.exports = files_info;