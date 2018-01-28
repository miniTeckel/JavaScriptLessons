const fs = require('fs');

function read (file){
    return new Promise((done, fail)=>{
        fs.readFile(file, 'utf8', (err, text) =>{
            if (err) {
                fail(err);
            }else{
                done (text);
            }   
        });
     })   
}



function write (filename, text){
    return new Promise((done, fail)=>{
        fs.writeFile(filename, text, err =>{
            if (err) {
                fail(err);
            }else{
                done (filename);
            }   
        });
     })   
}

 module.exports = {
    read,
    write
 };
 