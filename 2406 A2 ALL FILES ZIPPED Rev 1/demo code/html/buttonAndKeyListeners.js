//KEY CODES
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {

  if (e.which == ENTER) {
    handleGetPuzzleButton() //treat ENTER key like you would a submit
    document.getElementById('userTextField').value = ''

  }
  e.stopPropagation()
  e.preventDefault()
}

let fileLines = [];//This keeps a copy of the solution
function handleGetPuzzleButton(){

  let userText = document.getElementById('userTextField').value
  if (userText && userText != '') {
    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = '';
	  textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`

    let userRequestObj = {text: userText}
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''

    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //we are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText)

        let words = [];
        let line = "";
        let fileLinesIndex=0;
        // This loop gets all the lines from the text file and puts it in the words array
        for(let i=0; i<responseObj.puzzleLines.length; ++i){
          line = responseObj.puzzleLines[i].split(" ");
          //console.log("line" + line)
          for(let j=0; j<line.length; ++j){
            words.push({word: line[j], x: 50, y: 50});
            fileLines[fileLinesIndex] = words[fileLinesIndex].word.toString();
            ++fileLinesIndex;
          }
        }
        random_words(words);
        drawCanvas();
      }
    }
    xhttp.open("POST", "userText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }
}


function handleSolvePuzzleButton(){
  //console.log(fileLines);
  solvePuzzle(fileLines);
}