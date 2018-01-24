const file = require('./file-promise');

file
  .read('./data.txt')
  .then(data => data.toUpperCase())
  .then(data => file.write('./upper-data.txt', data))
  .then(filename => console.log('Создан файл %s', filename))
  .catch(err => console.error(err));
