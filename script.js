"use strict";

window.addEventListener("DOMContentLoaded", start);

const endpoint = "https://frontendjenn-13a8.restdb.io/rest/trelloitems";
const apiKey = "5e957ab7436377171a0c2342";

const form = document.querySelector("form");
const elements = form.elements;

function start() {
  //   elements.color.addEventListener("click", (e) => {
  //     console.log(elements.color.value);
  //     document.querySelector("body").style.background = elements.color.value;
  //   });
  get();

  document.querySelector("form").addEventListener("submit", (event) => {
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

    console.log(data);

    post(data);
  });

  document.querySelector("#showform").addEventListener("click", () => {
    form.classList.toggle("hide");
    document.querySelector("#showform").textContent = "-";
    if (form.classList.contains("hide")) {
      document.querySelector("#showform").textContent = "+";
      form.reset();
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
  const todoList = document.querySelector("#todo");
  const doingList = document.querySelector("#doing");
  const doneList = document.querySelector("#done");

  cardclone.querySelector("article").dataset.id = card._id;
  cardclone.querySelector("h4").textContent = card.title;
  cardclone.querySelector("p").textContent = card.desc;
  cardclone.querySelector("article").style.background = card.color;

  cardclone.querySelector(".deletebutton").addEventListener("click", () => deleteIt(card._id));

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
