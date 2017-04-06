function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

var nextWordsButton = document.getElementById("nextWordsButton");

function buildWordSuggestions(ul, wordWalks){
    ul.innerHTML = ""; //blank out list
    var textDirection = ul.getAttribute("text-direction")
    for (var i = 0; i < wordWalks.length; i++){
        var word   = wordWalks[i][0];
        var cursor = wordWalks[i][1];
        if (word == ""){ //blank word means we can chose to complete it
            word = (textDirection == "forward")?">":"<";
        }
        var li = document.createElement("LI");                 // Create a <li> node
        li.setAttribute("word",word);
        li.setAttribute("cursor",cursor);
        var textNode = document.createTextNode(word);        // Create a text node
        li.appendChild(textNode);                              // Append the text to <li>
        ul.appendChild(li);
    }
    ul.onclick = function(event){
        var target = getEventTarget(event);
        if (target.nodeName == "LI"){ //prevents clicking on ul parent
            var cursor = target.getAttribute('cursor');
            var word   = target.getAttribute('word');
            console.log("clicked on \"" + word + "\" [" + cursor + "]");
            //add the word to the working palindrome
            var a1 = document.getElementById("forwardText");
            var a2 = document.getElementById("reverseText");
            if (textDirection == "forward"){
                if (word == ">") { //complete the unfinished word
                    a1.textContent = a1.textContent + ">";
                } else {
                    a1.textContent = a1.textContent + word + ">";
                    a2.textContent = reverseString(word) + a2.textContent;
                }
            } else if (textDirection == "reverse"){
                if (word == "<") { //complete the unfinished word
                    a2.textContent = "<" + a2.textContent;
                } else {
                    a1.textContent = a1.textContent + reverseString(word);
                    a2.textContent = "<" + word + a2.textContent;
                }
            }
            //update the palindrome space cursor and its display
            ps.cursor = cursor;
            var a = document.getElementById("psCursor");
            a.textContent = String(ps.cursor);
            //continue at new cursor location
            showNextWords();
        }
    };
}

function showNextWords(){
    console.log("showNextWords: ps.cursor = " + ps.cursor);
    var wordWalks = ps.nextWords();
    //add the forward word suggestions
    var ul = document.getElementById("forwardWordSuggestions");
    buildWordSuggestions(ul, wordWalks.fWalks);
    //add the reverse word suggestions
    var ul = document.getElementById("reverseWordSuggestions");
    buildWordSuggestions(ul, wordWalks.rWalks);
}

//nextWordsButton.onclick = function(){
//    
//};

window.onload = function(){
    //ps.cursor = 129;
    showNextWords();
};
