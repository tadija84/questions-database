const button = document.getElementById("newQuestionButton");
button.addEventListener("click", setNewData);

const showDataButton = document.getElementById("showData");
showDataButton.addEventListener("click", getData);

const bigWrap = document.getElementById("bigWrap");
const questWrapper = document.createElement("div");
const answersPage = document.getElementById("answers");

async function setNewData() {
  const userName = document.getElementById("userName").value;
  const newQuestion = document.getElementById("newQuestion").value;
  let question = {
    userName: userName,
    questcontent: newQuestion,
    numberoflikes: 0,
    numberofdislikes: 0,
    timeofposting: Date.now(),
    answers: [],
  };
  let data = JSON.stringify(question);
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };
  fetch("/api", options).then((res) => {});
  window.location.reload();
}

async function likeQuestion(x) {
  let request = {
    questionId: x,
  };
  let data = JSON.stringify(request);
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };
  fetch("/like", options);
  window.location.reload();
}

async function dislikeQuestion(x) {
  let request = {
    questionId: x,
  };
  let data = JSON.stringify(request);
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };
  fetch("/dislike", options);
  window.location.reload();
}

async function getData() {
  const response = await fetch("/api");
  const questData = await response.json();
  for (let i = questData.length - 1; i >= 0; i--) {
    const mainQuestion = document.createElement("div");
    mainQuestion.setAttribute("class", "one-question");
    mainQuestion.setAttribute("id", `${questData[i]._id}`);
    const questContent = document.createElement("p");
    questContent.textContent = `${questData[i].questcontent}`;
    questContent.setAttribute("class", "question-content");
    const questInterData = document.createElement("div");
    questInterData.setAttribute("class", "question-interaction");
    const likesWrap = document.createElement("div");
    likesWrap.setAttribute("class", "likes-wrap");
    const dislikesWrap = document.createElement("div");
    dislikesWrap.setAttribute("class", "dislikes-wrap");
    const numberOfLikes = document.createElement("p");
    numberOfLikes.textContent = `${questData[i].numberoflikes}`;
    numberOfLikes.setAttribute("class", "number-likes");
    const numberOfDislikes = document.createElement("p");
    numberOfDislikes.textContent = `${questData[i].numberofdislikes}`;
    numberOfDislikes.setAttribute("class", "number-dislikes");
    const likeButton = document.createElement("button");
    likeButton.textContent = "Like";
    likeButton.addEventListener("click", function () {
      likeQuestion(questData[i]._id);
    });
    const dislikeButton = document.createElement("button");
    dislikeButton.textContent = "Dislike";
    dislikeButton.addEventListener("click", function () {
      dislikeQuestion(questData[i]._id);
    });
    likesWrap.append(numberOfLikes, likeButton);
    dislikesWrap.append(numberOfDislikes, dislikeButton);
    questInterData.append(likesWrap, dislikesWrap);
    const allAnswers = document.createElement("button");
    allAnswers.setAttribute("class", "answers-button");
    allAnswers.textContent = "See the answers";
    allAnswers.addEventListener("click", function () {
      showTheAnswers(questData[i]);
    });
    mainQuestion.append(questContent, questInterData, allAnswers);
    questWrapper.append(mainQuestion);
  }
  bigWrap.append(questWrapper);
}

getData();

async function showTheAnswers(question) {
  const resHead = document.createElement("h2");
  resHead.setAttribute("class", "answers-header");
  resHead.textContent = question.questcontent;
  answersPage.append(resHead);
  if (question.answers.length == 0) {
    const noAnswer = document.createElement("h2");
    noAnswer.setAttribute("class", "no-answer");
    noAnswer.textContent = "There is no answers yet. Be first to answer!";
    answersPage.append(noAnswer);
  } else {
    const answersFor = document.createElement("div");
    for (let i = 0; i < question.answers.length; i++) {
      const anotherAnswer = document.createElement("div");
      anotherAnswer.textContent = question.answers[i];
      anotherAnswer.setAttribute("class", "quest-answers");
      answersFor.append(anotherAnswer);
    }
    answersPage.append(answersFor);
  }
  console.log(resHead);
  const answerForm = document.createElement("div");
  answerForm.setAttribute("class", "answer-form");
  const answerInput = document.createElement("input");
  answerInput.setAttribute("placeholder", "Answer the question");
  answerInput.setAttribute("class", "answer-input");
  const answButton = document.createElement("button");
  answButton.textContent = "Send answer";
  answButton.addEventListener("click", function () {
    sendNewAnswer(question._id, answerInput.value, question);
  });
  answerForm.append(answerInput, answButton);
  const closeWrap = document.createElement("div");
  closeWrap.setAttribute("class", "close-wrap");
  const closeButton = document.createElement("button");
  closeButton.textContent = "Back to main page";
  closeButton.addEventListener("click", hideTheAnswers);
  closeButton.setAttribute("class", "close-button");
  closeWrap.append(closeButton);
  answersPage.append(answerForm, closeWrap);
  answersPage.style.display = "block";
}

const hideTheAnswers = () => {
  answersPage.innerHTML = "";
  answersPage.style.display = "none";
};

const sendNewAnswer = (questId, answer, question) => {
  let reqCont = {
    newContent: answer,
    questId: questId,
  };
  let data = JSON.stringify(reqCont);
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };
  fetch("/answer", options);
  alert("Your answer is sent and will be posted soon.");
  hideTheAnswers();
};
