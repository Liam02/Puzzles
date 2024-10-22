//DATA MODELS
//Use javascript array of objects to represent words and their locations
let words = []

const canvas = document.getElementById('canvas1') //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY) {

  var c = document.getElementById("canvas1");
  var ctx = c.getContext("2d");
  ctx.font = "20pt Arial";

  for (let i = 0; i < words.length; i++) {

    if ((words[i].x + ctx.measureText(words[i].word).width) > aCanvasX && aCanvasX > words[i].x && (words[i].y-24)<aCanvasY&&aCanvasY<words[i].y){
      return words[i];
    }
  }
  return null
}

function random_words(word){
  var c = document.getElementById("canvas1");
  var ctx = c.getContext("2d");
  ctx.font = "20pt Arial";
  let random=0;

  for (let i=0; i<word.length; ++i){
    word[i].x =Math.floor(Math.random()*(canvas.width-ctx.measureText(word[i].word).width));
    random = Math.random();
    if (random>0.5){
      word[i].y =Math.floor(random*(canvas.height));
    }
    else{
      word[i].y =Math.floor(random*(canvas.height)+24);
    }
  }
  words = word;
}

//random_words(words);


function solvePuzzle(correctLines){
  let solveWord;

  //This loop reorganizes all the words in the correct order that appear on the canvas in the words array
  for(let i=0; i<words.length; ++i){
    for(let j=i+1; j<words.length; ++j){
      if(words[i].y-24>words[j].y){
        solveWord = words[i];
        words[i]=words[j];
        words[j]=solveWord;
      }
      else if(words[i].y-24<words[j].y && words[i].y+24>words[j].y && words[i].x>words[j].x){
        solveWord = words[i];
        words[i]=words[j];
        words[j]=solveWord;
      }
    }
      //console.log(words[i]);
  }
  
  let checkAnswer=0;
  //This loop checks if the puzzle was solved correctly
  while(checkAnswer<words.length){
    if (correctLines[checkAnswer]!=words[checkAnswer].word.toString()){
      break;
    }
    else{
      ++checkAnswer;
    }
  }

  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = '';
  var line = '';
  let maxYs = [];
  let maxY = words[0].y;
  let maxYindex = 0;
  let lineLength = 1;
  let lineLengths = [];
  let lineLengthsIndex=0;
  let newLine = ''
  //This loop has two functions:
  //First it adds all the words in the correct order on the html and colors them the proper color depending on the answer
  //Second it records the min y value of each line as appears on the canvas (but i call it maxY because it make the words go up) and records the length of the lines.
  for (var i=0; i<words.length-1; ++i){
    if(words[i].y-24>words[i+1].y || words[i].y+24<words[i+1].y){
      //userText = words[i].word.toString();
      line = line + words[i].word.toString()
      if(checkAnswer!=words.length){
        textDiv.innerHTML = textDiv.innerHTML + `<span class="wrong_answer"> ${line}</span>`
      }
      else if(checkAnswer==words.length){
        textDiv.innerHTML = textDiv.innerHTML + `<span class="correct_answer"> ${line}</span>`
      }
      textDiv.innerHTML = textDiv.innerHTML + `<p> ${newLine}</p>`

      line = '';
      maxYs[maxYindex] = maxY;
      maxY = words[i+1].y;
      ++maxYindex;
      lineLengths[lineLengthsIndex]=lineLength;
      ++lineLengthsIndex;
      lineLength = 1;
    }
    else{
      line = line + words[i].word.toString()+' ';
      ++lineLength;
    }
    if(words[i].y>words[i+1].y){
      maxY = words[i+1].y;
    }
  }

  //All this is to proscess the last line of the loop properly
  maxYs[maxYindex] = maxY;
  lineLengths[lineLengthsIndex]=lineLength;
  line = line + words[i].word.toString();
  if(checkAnswer!=words.length){
    textDiv.innerHTML = textDiv.innerHTML + `<span class="wrong_answer"> ${line}</span>`
  }
  else if(checkAnswer==words.length){
    textDiv.innerHTML = textDiv.innerHTML + `<span class="correct_answer"> ${line}</span>`
  }


  maxYindex = 0;
  indexOFwords = 0;
  //This loop updates all the words y position to allign them properly then at the end I call drawCanvas to uptdate the words positions
  for(let i=0; i<lineLengths.length; ++i){
    //console.log(lineLengths[i]);
    for(let j=0; j<lineLengths[i]; ++j){
      words[indexOFwords].y = maxYs[maxYindex];
      ++indexOFwords;
    }
    ++maxYindex;
  }
  //console.log(words);
  drawCanvas();
}


function drawCanvas(){
  /*
  Call this function whenever the canvas needs to be redrawn.
  */
  const context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '20pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++){
    
    let data = words[i]
    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)
  }
}