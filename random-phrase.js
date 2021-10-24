//Script writen by Clément SCHMOUKER
//clement dot schmouker at gmail dot com
//29/05/2015
//You are free to use this script as you want, but please, credit me :)
//This document is commented for an easier use !

var nameArray = [
  "looking for answers.",
  "on the run.",
  "wondering where all the time has      gone.",
  "packing up her soapbox.",
  "having her cake and eating it,        too.",
  "commiting a faux paus",
  "engaging serendipity.",
  "guessing, and getting it right."
]; //One of those will be randomly chosen

var lastIndex = 0; //Used to remember the last word picked

//This function will get a random INT used later as the array index
function getRandomInt(iMin, iMax) {
  var newIndex = Math.floor(Math.random() * (iMax - iMin)) + iMin;
  while (lastIndex == newIndex) {
    var newIndex = Math.floor(Math.random() * (iMax - iMin)) + iMin;
  }
  lastIndex = newIndex;

  return newIndex;
}

function pickRandomName() {
  var domHeaderName = document.getElementById("randomPhrase"); //Put the ID of the DOM element you want to change here
  var randomIndex = getRandomInt(0, nameArray.length);

  //Put the randomly chosen name in the DOM
  domHeaderName.innerHTML = nameArray[randomIndex];
  //loop
  setTimeout(pickRandomName, 2000); //Loop every 2000ms (2s)
}

pickRandomName();