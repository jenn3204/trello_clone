"use strict";

window.addEventListener("DOMContentLoaded", start);

const endpoint = "https://frontendjenn-13a8.restdb.io/rest/trelloitems";
const apiKey = "5e957ab7436377171a0c2342";

const addForm = document.querySelector("#add_form");
const editForm = document.querySelector("#edit_form");

const elements = addForm.elements;
const editElements = editForm.elements;

const todoList = document.querySelector("#todo");
const doingList = document.querySelector("#doing");
const doneList = document.querySelector("#done");

function start() {
  get();

  addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let data = {
      title: elements.title.value,
      desc: elements.desc.value,
      est: elements.estimate.value,
      deadline: elements.deadline.value,
      color: elements.color.value,
      creator: elements.creator.value,
      list: elements.radio.value,
    };

    console.log("første data:" + data);

    post(data);
  });

  document.querySelector("#showform").addEventListener("click", () => {
    addForm.classList.toggle("hide");
    document.querySelector("#showform").textContent = "-";
    if (addForm.classList.contains("hide")) {
      document.querySelector("#showform").textContent = "+";
      addForm.reset();
    }
  });
}

function get() {
  fetch(endpoint, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset-utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  })
    .then((e) => e.json())
    .then(showCards);
}

function showCards(data) {
  data.forEach(showCard);
}

function showCard(card) {
  const cardTemplate = document.querySelector("#card").content;
  const cardclone = cardTemplate.cloneNode(true);

  let deadline = card.deadline;
  let t = deadline.indexOf("T");
  let date = deadline.slice(0, t);
  console.log(date);

  cardclone.querySelector("article").dataset.id = card._id;
  cardclone.querySelector("h4").textContent = card.title;
  cardclone.querySelector("#desc_p").textContent = card.desc;
  cardclone.querySelector("#deadline_p").textContent = date;
  cardclone.querySelector("article").style.background = card.color;

  cardclone.querySelector(".deletebutton").addEventListener("click", () => deleteIt(card._id));
  cardclone.querySelector(".edit").addEventListener("click", () => showPopup(card, card._id));
  cardclone.querySelector(".right").addEventListener("click", () => right(card, card._id));
  cardclone.querySelector(".left").addEventListener("click", () => left(card, card._id));

  console.log(card.list);

  if (card.list == "todo") {
    todoList.appendChild(cardclone);
  }

  if (card.list == "doing") {
    doingList.appendChild(cardclone);
  }

  if (card.list == "done") {
    doneList.appendChild(cardclone);
  }
}

function showPopup(card, id) {
  console.log("show popup");
  document.querySelector("#popup_form").classList.remove("hide");

  console.log("id" + id);

  editElements.title.value = card.title;
  editElements.desc.value = card.desc;
  editElements.creator.value = card.creator;
  editElements.deadline.value = card.deadline;
  editElements.estimate.value = card.est;
  editElements.radio.value = card.list;
  editElements.color.value = card.color;

  document.querySelector("#close").addEventListener("click", () => {
    document.querySelector("#popup_form").classList.add("hide");
    editForm.classList = "";
  });

  editForm.addEventListener("submit", () => submitEdit(event, id, card));
}

function submitEdit(event, id, card) {
  event.preventDefault();
  document.querySelector("#popup_form").classList.add("hide");
  console.log("nu id" + id);

  put(id, card);
}

function post(data) {
  console.log("sker det?");
  const postData = JSON.stringify(data);
  fetch(endpoint, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
    body: postData,
  })
    .then((res) => res.json())
    .then((data) => showCard(data))
    .then(document.querySelector("#showform").click());
}

function deleteIt(id) {
  document.querySelector(`article[data-id="${id}"]`).remove();

  fetch(`${endpoint}/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

function put(id, card) {
  const newData = {
    title: editElements.title.value,
    desc: editElements.desc.value,
    est: editElements.estimate.value,
    deadline: editElements.deadline.value,
    color: editElements.color.value,
    creator: editElements.creator.value,
    list: editElements.radio.value,
  };

  console.log("title:" + editElements.title.value);

  let postData = JSON.stringify(newData);

  fetch(`${endpoint}/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
    body: postData,
  })
    .then((d) => d.json())
    .then((newData) => {
      let newclone = document.querySelector(`article[data-id="${id}"]`);
      newclone.remove();

      let deadline = newData.deadline;
      let t = deadline.indexOf("T");
      let date = deadline.slice(0, t);

      newclone.querySelector("h4").textContent = newData.title;
      newclone.querySelector("#desc_p").textContent = newData.desc;
      newclone.querySelector("#deadline_p").textContent = date;
      newclone.style.background = newData.color;
      document.querySelector(`#${newData.list}`).appendChild(newclone);
    });
}

function right(card, id) {
  console.log(card);

  let cardclone = document.querySelector(`article[data-id="${id}"]`);

  if (card.list == "todo") {
    doingList.appendChild(cardclone);
    card.list = "done";
  } else if (card.list == "doing") {
    doneList.appendChild(cardclone);
    card.list = "done";
  } else if (card.list == "done") {
    doneList.appendChild(cardclone);
  }
}

function left(card, id) {
  let cardclone = document.querySelector(`article[data-id="${id}"]`);
  console.log(card.list);

  if (card.list == "todo") {
    todoList.appendChild(cardclone);
  } else if (card.list == "doing") {
    todoList.appendChild(cardclone);
    card.list = "todo";
  } else if (card.list == "done") {
    doingList.appendChild(cardclone);
    card.list = "doing";
  }
}
