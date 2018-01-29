const EventEmitter = require('events');

class ChatApp extends EventEmitter {
  /**
   * @param {String} title
   */
  constructor(title) {
    super();

    this.title = title;

    // Посылать каждую секунду сообщение
    setInterval(() => {
      this.emit('message', `${this.title}: ping-pong`);
    }, 1000);
  }
  
  // метод close, который вызывает событие close 
  // (событие вызывается один раз, setInterval как в констукторе, не нужен).
  close(){
    this.emit('close');
  }

}

let webinarChat =  new ChatApp('webinar');
let facebookChat = new ChatApp('=========facebook');
let vkChat =       new ChatApp('---------vk');

let chatOnMessage = (message) => {
  console.log(message);
};

// Добавить обработчик события message для Чата Вебинара (webinarChat),
// который выводит в консоль сообщение 'Готовлюсь к ответу'.
// Обработчик создать в отдельной функции.
let ready_Message = (message) => {
  console.log("Готовлюсь к ответу");
};

webinarChat.on('message', ready_Message);

// Для Вконтакте (vkChat) установить максимальное количество обработчиков событий, равное 2.
vkChat.setMaxListeners(2);

// Добавить обработчик 'Готовлюсь к ответу' из пункта 1.1 к чату Вконтакте.
vkChat.on('message', ready_Message);


// Для чата вконтакте (vkChat) добавить обработчик close,
// выводящий в консоль текст "Чат вконтакте закрылся :(".
let onClose = () => {
  console.log("Чат вконтакте закрылся :(");
};
vkChat.on('close', onClose);


webinarChat.on('message', chatOnMessage);
facebookChat.on('message', chatOnMessage);
vkChat.on('message', chatOnMessage);

// Закрыть вконтакте
setTimeout( ()=> {
  console.log('Закрываю вконтакте...');
  vkChat.removeListener('message', chatOnMessage);
  vkChat.removeListener('message', ready_Message);
  // Вызывать у чата вконтакте метод close().
  vkChat.close();
}, 10000 );


// Закрыть фейсбук
setTimeout( ()=> {
  console.log('Закрываю фейсбук, все внимание — вебинару!');
  facebookChat.removeListener('message', chatOnMessage);
}, 15000 );


// Закрыть вебинар
setTimeout( ()=> {
  console.log('Закрываю вебинар!');
  webinarChat.removeListener('message', chatOnMessage);
  webinarChat.removeListener('message', ready_Message);
}, 30000 );