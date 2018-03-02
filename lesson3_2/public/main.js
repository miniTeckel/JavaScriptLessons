const textArea = document.querySelector(`.chat-window`);

const name = document.querySelector(`.input-name`);
const lastname = document.querySelector(`.input-lastname`);
const phone = document.querySelector(`.input-phone`);

const updateId = document.querySelector(`.update-id`);
const updateName = document.querySelector(`.update-name`);
const updateLastname = document.querySelector(`.update-lastname`);
const updatePhone = document.querySelector(`.update-phone`);

const deleteId = document.querySelector(`.delete-id`);

const findName = document.querySelector(`.find-name`);
const findLastname = document.querySelector(`.find-lastname`);
const findPhone = document.querySelector(`.find-phone`);

const sendUserButton = document.querySelector(`.send-user`);
const getDataButtton = document.querySelector(`.get-data`);
const updateUserButton = document.querySelector(`.update-user`);
const findUserButton = document.querySelector(`.find-user`);
const deleteUserButton = document.querySelector(`.delete-user`);

const url = `http://localhost:3000/api/v1/users`;

textArea.value = `WeLcOmE to the DaTaBaSe!! \n`;

const preprocessData = (data) => {
  let preprocessed = ``;
  data.forEach((user) => {
    const userData = `ID: ${user._id},\nNAME: ${user.name},\nLASTNAME: ${user.lastname},\nPHONE: ${user.phone}\n-------------------------------`;
    preprocessed = preprocessed + `\n` + userData;
  });

  return preprocessed;
};

sendUserButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  const user = {};
  user.name = name.value;
  user.lastname = lastname.value;
  user.phone = phone.value;

  name.value = ``;
  lastname.value = ``;
  phone.value = ``;

  const requestSettings = {
    body: JSON.stringify(user),
    headers: {
      'Content-Type': `application/json`
    },
    method: `POST`
  };

  fetch(url, requestSettings)
    .then((data) => {
      console.log(`Request succeeded`);
      textArea.value = textArea.value + `\n UsEr inserted SuCcEsSfUlLy! \n`
    })
    .catch((err) => {
      textArea.value = textArea.value + `Request failed! \n`;
      console.log(`Request failed`, err);
    })
});

getDataButtton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      textArea.value = textArea.value + preprocessData(data);
    })
    .catch((err) => {
      textArea.value = textArea.value + `Request failed! \n`;
      console.log(`Request failed`, err);
    })
});

updateUserButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  const user = {};
  user.id = updateId.value;
  user.name = updateName.value;
  user.lastname = updateLastname.value;
  user.phone = updatePhone.value;

  updateId.value = ``;
  updateName.value = ``;
  updateLastname.value = ``;
  updatePhone.value = ``;

  const requestSettings = {
    body: JSON.stringify(user),
    headers: {
      'Content-Type': `application/json`
    },
    method: `PUT`
  };

  fetch(url, requestSettings)
    .then((data) => {
      console.log(`Request succeeded`);
      textArea.value = textArea.value + `\n UsEr updated SuCcEsSfUlLy! \n`
    })
    .catch((err) => {
      textArea.value = textArea.value + `Request failed! \n`;
      console.log(`Request failed`, err);
    })
});

deleteUserButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  const user = {};
  user.id = deleteId.value;

  deleteId.value = ``;

  const requestSettings = {
    body: JSON.stringify(user),
    headers: {
      'Content-Type': `application/json`
    },
    method: `DELETE`
  };

  fetch(url, requestSettings)
    .then((data) => {
      console.log(`Request succeeded`);
      textArea.value = textArea.value + `\n UsEr DESTROYED SuCcEsSfUlLy! \n`
    })
    .catch((err) => {
      textArea.value = textArea.value + `Request failed! \n`;
      console.log(`Request failed`, err);
    })
});

findUserButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  const user = {};
  user.name = findName.value;
  user.lastname = findLastname.value;
  user.phone = findPhone.value;

  findName.value = ``;
  findLastname.value = ``;
  findPhone.value = ``;

  const requestSettings = {
    body: JSON.stringify(user),
    headers: {
      'Content-Type': `application/json`
    },
    method: `POST`
  };

  fetch(url + `/find`, requestSettings)
    .then((data) => data.json())
    .then((user) => {
      console.log(`Request succeeded`);
      textArea.value = textArea.value + `\n UsEr found: ${preprocessData(user)} \n`
    })
    .catch((err) => {
      textArea.value = textArea.value + `Request failed! \n`;
      console.log(`Request failed`, err);
    })
});
