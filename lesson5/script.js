const http = require('http');
const fs = require('fs');
const port = 3000;
const form_contents = fs.readFileSync('task.html', 'utf8');
//const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate';

//const request = http.request(url);

function read_request(req) {
    return "REQUEST";
}

function translate(text) {
    return "TRANSLATED";
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
        var text = read_request(req);
        var translated = translate(text);

        res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
        res.write(translated);
        res.end();

        // 1. Прочитать данные клиента (см. презентацию)
        // 2. Отправить запрос на Яндекс
        // 3. Получить переведенный текст
        // 4. Отправить текст клиенту
    }

}

const server = http.createServer(); 
server.on('error', err => console.error(err)); 
server.on('request', handler);
server.on('listening', () => {
        console.log('Start HTTP on port %d', port); });
server.listen(port);






/*

function btnClick(text)
        {
        }



request.on('response');
request.end();


// обработчик ответа сервера
function handler(response) {
   // сбор ответа сервера
    let data = '';
    response.on('data', function (chunk) {
    data += chunk; });
    // приступаем к обработке данных б отдав их функции process
    response.on('end', function () { process(data);
    }); }

// разбираем данные, которые пришли с сервера
function parse(data, type) { switch (type) {
    case 'application/json': data = JSON.parse(data); break;
    case 'application/x-www-form-urlencoded': data = querystring.parse(data);
    break;
    }
    return data; }

    function process(data) {
        let curr = JSON.parse(data); curr
        .filter(item => item.CharCode === 'USD' || item.CharCode === 'EUR')
        .forEach(item => console.log(item.Name, item.Value)); }


*/