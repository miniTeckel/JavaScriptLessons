const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url')
const querystring = require('querystring');
const port = 3000;
const form_contents = fs.readFileSync('task.html', 'utf8');

function process(data) {
    let curr = JSON.parse(data);

}

function translate_response(res, callback) {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', function () { callback(data); });
}

// Отправить запрос на Яндекс и получить переведенный текст
function translate(text, callback) {
    const key = 'trnsl.1.1.20160723T183155Z.f2a3339517e26a3c.d86d2dc91f2e374351379bb3fe371985273278df';
    const lang = 'ru-en';

    const query = querystring.stringify({
        'key': key,
        'lang': lang,
        'text': text
    });
    const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?'+query;
 
    const request = https.request(url);
    request.on('response', res => translate_response(res, callback)); 
    request.end();
}


// Чтение запроса клиента
function on_request(req, res) {        
    let data = '';
    req.on('data', chunk => data += chunk); 
    req.on('end', () => {
        params = querystring.parse(data);
        translate(params.comment, text => {
            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.write(text);
            res.end(); 
        });
    });
}


function handler(req, res) {
    if (req.method == "GET") {
        console.log(req.method);
        console.log(req.url);
        //console.log(JSON.stringify(req.headers));

        res.writeHead(200, 'OK', {'Content-Type': 'text/html'}); 
        res.write(form_contents);
        res.end();
    } else {
        on_request(req, res);

        // 4. Формить текст клиенту и обработать ошибки
    }
}

const server = http.createServer(); 
server.on('error', err => console.error(err)); 
server.on('request', handler);
server.on('listening', () => {
        console.log('Start HTTP on port %d', port); });
server.listen(port);