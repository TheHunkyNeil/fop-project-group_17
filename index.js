let gameMode = 0;
let vocabularyList = [];
let term = {};

// Add word popup----------------------------------------------------
function addNewVocabulary() {
  let addVocabulary = document.querySelector("#addVocabulary");
  addVocabulary.classList.remove("dialogBox");
  //classList.remove("") removes the existing class name, achieved by linking display: none in css
  //remove dialogBox will display the word box interface
}

// The popup in training mode----------------------------------------------------
function trainGame(mode) {
  //This mode depends on the number in the html
  gamemode = mode;

  let trainMode = document.querySelector("#trainMode");
  trainMode.classList.remove("dialogBox");

  nextVocabulary(false);
  //Because it is the first one to click directly, and the sumbit has not been clicked yet, so this is needed to avoid it, and the next one is to directly click the sumbit
  //If there is no this one, it will not trigger the prompt that the question bank is empty
}

// Confirm adding word button--------------------------------------------
function submitAddVocabulary() {
  let english = document.querySelector("#english");
  let swedish = document.querySelector("#swedish");

  if (!english.value) {
    //english.value = false = ""
    //!english.value = true
    return alert("Please fill in English!");
  }
  if (!swedish.value) {
    //swedish.value = false = ""
    //!swedish.value = true
    return alert("Please fill in Swedish!");
  }

  vocabularyList.push({
    english: english.value,
    swedish: swedish.value,
    passed: false,
    //Add to set as not passed first
  });

  localStorage.setItem("vocabularyList", JSON.stringify(vocabularyList));
  //localStorage.setItem save data syntax, "key", "value")
  //JSON.stringify method converts vocabularyList to JSON form

  cancelAddVocabulary();
  refreshVocabulary();
}

// Cancel adding button, return to main page----------------------------------------------------
function cancelAddVocabulary() {
  let english = document.querySelector("#english");
  let swedish = document.querySelector("#swedish");
  swedish.value = "";
  english.value = "";

  let addVocabulary = document.querySelector("#addVocabulary");
  addVocabulary.classList.add("dialogBox");
}

//Check the submit button for the next word ----------------------------------------------------
function nextVocabulary(Check = true) {
  //When the function to check the word is correct, run this
  if (Check) {
    checkVocabulary();
  }

  term = randomVocabulary();
  //Then shuffle the Vocabulary randomly

  let mode = Math.floor(Math.random() * 2);
  //Math.floor(Math.random() * 2) = 0to trigger this
  //Math.floor is rounded down, and Math.random returns a random number between 0 (inclusive) and 1 (exclusive)
  //To decide whether to display English or Swedish, it is basically a 50% to 50%

  let english = document.querySelector("#Englishwords");
  let swedish = document.querySelector("#Swedishwords");

  if (mode == 0) {
    swedish.value = "";
    english.value = term.english;
    swedish.readOnly = false;
    english.readOnly = true;
  } else {
    english.value = "";
    swedish.value = term.swedish;
    english.readOnly = false;
    swedish.readOnly = true;
  }
}

//The cancel game button is the same as the one above that cancels adding vocabulary----------------------------------------------------
function cancelGame() {
  let english = document.querySelector("#Englishwords");
  let swedish = document.querySelector("#Swedishwords");
  english.value = "";
  swedish.value = "";

  let trainMode = document.querySelector("#trainMode");
  trainMode.classList.add("dialogBox");
}

//Refresh master page mastered and unmastered----------------------------------------------------
function refreshVocabulary() {
  let passedVocabulary = document.querySelector(".passedVocabulary");
  let notPassedVocabulary = document.querySelector(".notPassedVocabulary");
  let alreadyPassed = "";
  let notAlreadyPassed = "";

  vocabularyList.forEach((i) => {
    //Traverse, list each element i of the array, call each element of the array
    //.forEach((element) => { /* … */ })
    if (i.passed) {
      //If i.passed is true, put it in the passed part
      alreadyPassed += `<span>${i.english}</span>`;
      //One by one, the words sandwiched between the two spans are all connected together
    } else {
      notAlreadyPassed += `<span>${i.english}</span>`;
    }
  });

  if (alreadyPassed) {
    passedVocabulary.innerHTML = alreadyPassed;
    //innerHTML property sets or returns the HTML between the start and end tags of the table row, changing the text, URL, and link target
    //Through the above forEach traversal through the linkage, and then put them in through innerHTML
  } else {
    passedVocabulary.innerHTML = `<empty>There is no vocabulary here, just add it!</empty>`;
  }

  if (notAlreadyPassed) {
    notPassedVocabulary.innerHTML = notAlreadyPassed;
  } else {
    notPassedVocabulary.innerHTML = `<empty>There is no vocabulary here, just add it!</empty>`;
    标;
  }
}

//random Vocabulary----------------------------------------------------
function randomVocabulary() {
  if (gameMode == 0) {
    array = vocabularyList;
    //0 is training all
  } else if (gameMode == 1) {
    array = vocabularyList.filter((i) => !i.passed);
    //The filter() method creates a new array, and the elements in the new array are checked by checking all the elements in the specified array that meet the conditions, which is to filter passed=true
    //1 are words not passed in training
  }

  if (!array.length) {
    //array.length = 0 = false
    //!array.length = true
    alert("The vocabulary list is empty, good job!");

    let trainMode = document.querySelector("#trainMode");
    trainMode.classList.add("dialogBox");
  }

  random = Math.floor(Math.random() * array.length);
  //Train random words through random Math.floor(Math.random()*number in array);
  //Through this to get an integer that is rounded down, and then assign it to random
  return array[random];
  //array[random] = vocabularyList's index
  //vocabularyList[Math.floor(Math.random() * array.length)]
  //Then return to the array, that is, the index of the vocabularyList is random
  //If not returned, neither English nor Swedish will come out
}

//Check if the words filled in are correct----------------------------------------------------
function checkVocabulary() {
  let english = document.querySelector("#Englishwords");
  let swedish = document.querySelector("#Swedishwords");
  let passed = false;
  //not passed is false firtst

  if (
    english.value == term.english &&
    swedish.value == term.swedish
    //
  ) {
    passed = true;
    //Change passed to true to prove that it has learned, but it has not been attached to the local value
  } else {
    if (english.value != term.english) {
      alert("The correct answer is “" + term.english + "” , come on!");
    }
    if (swedish.value != term.swedish) {
      alert("The correct answer is “" + term.swedish + "” , come on!");
    }
  }

  english.value = "";
  swedish.value = "";

  let wordIndex = vocabularyList.findIndex((i) => i.english == term.english);
  //array.findIndex(function(currentValue, index, arr), thisValue)
  //The index of the current element
  //findIndex() For an empty array, the function will not be executed.
  if (wordIndex !== -1) {
    //If .findIndex has no eligible elements, it will return -1
    //wordIndex !== -1 = true
    vocabularyList[wordIndex].passed = passed;
    //vocabularyList[vocabularyList.findIndex((i) => i.english == term.english)]
    //The first database passed, the second function passed
  }

  localStorage.setItem("vocabularyList", JSON.stringify(vocabularyList));
  //localStorage.setItem("key", "value"); save data syntax
  //The JSON.stringify method converts an object into JSON form
  refreshVocabulary();
}

// Refresh the page-------------------------------------------------
window.onload = () => {
  //window.onload() The method is used to perform the refresh operation immediately after the webpage is loaded
  vocabularyList = JSON.parse(localStorage.getItem("vocabularyList")) || [];
  //localStorage.getItem("key")
  //JSON.parse() method converts data into a JavaScript object
  //If it is null, get an empty []
  refreshVocabulary();
};

// localStorage.clear();
