//Script writen by Clément SCHMOUKER
//clement dot schmouker at gmail dot com
//29/05/2015
//You are free to use this script as you want, but please, credit me :)
//This document is commented for an easier use !


var nameArray = [
  "<a class='phrase' target='_blank' href='https://poets.org/poem/revolutionary-letter-2' target='_blank'>looking for answers.</a>",
  "<a class='phrase' target='_blank' href='https://www.youtube.com/watch?v=fzMU2luS7uw' target='_blank'>on the run.</a>",
  // "<a class='phrase' href=''>packing up her soapbox.</a>",
  // "<a class='phrase' href=''>having her cake and eating it.</a>",
  "<a class='phrase' target='_blank' href='https://jacksonpollock.org/' target='_blank'>committing to the bit.</a>",
  "<a class='phrase' target='_blank' href='https://www.jilliantamaki.com/trash-the-block' target='_blank'>engaging serendipity.</a>",
  "<a class='phrase' target='_blank' href='https://img.buzzfeed.com/buzzfeed-static/static/2017-09/25/6/asset/buzzfeed-prod-fastlane-03/anigif_sub-buzz-24369-1506334088-1.gif' target='_blank'>guessing, and getting it right.</a>",
  "<a class='phrase' target='_blank' href='https://www.youtube.com/watch?v=ZFq_Ib8BkVI' target='_blank'>preaching to the choir.</a>",
  "<a class='phrase' target='_blank' href='https://fontsinuse.com/' target='_blank'>keeping tabs.</a>",
  "<a class='phrase' target='_blank' href='https://www.futurefonts.xyz/' target='_blank'>believing the best.</a>",
  "<a class='phrase' target='_blank' href='https://pointerpointer.com/' target='_blank'>taking drastic measures.</a>",
  // "<a class='phrase' href=''>trusting her gut.</a>",
  "<a class='phrase' href='https://www.merriam-webster.com/dictionary/non%20sequitur' target='_blank'>catching non sequiturs.</a>",

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
  var domHeaderName = document.getElementById("nameChange"); //Put the ID of the DOM element you want to change here
  var randomIndex = getRandomInt(0, nameArray.length);

  //Put the randomly chosen name in the DOM
  domHeaderName.innerHTML = nameArray[randomIndex];
  //loop
  setTimeout(pickRandomName, 8000); //Loop every 2000ms (2s)
}

pickRandomName();
