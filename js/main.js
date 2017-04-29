var DEBUG_MODE = false;

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

document.onkeydown = function (e) {
    e = e || window.event;
    // use e.keyCode
    if (e.keyCode == 68 && e.ctrlKey && e.shiftKey){
        //crtl-shift-d -> toggle DEBUG_MODE
        DEBUG_MODE = !DEBUG_MODE;
        console.log("toggled DEBUG_MODE = " + DEBUG_MODE);
    }
};

function buildWordSuggestions(palindrome_space, ul, wordWalks, hide_backwards_termination_markers){
    if (hide_backwards_termination_markers == null){
        hide_backwards_termination_markers = !DEBUG_MODE;
    }
    var textDirection = ul.getAttribute("text-direction");
    console.log("function buildWordSuggestions:");
    console.log("\n\thide_backwards_termination_markers == " + hide_backwards_termination_markers);
    console.log("\n\ttextDirection == " + textDirection);

    ul.innerHTML = ""; //blank out list
    for (var i = 0; i < wordWalks.length; i++){
        var word   = wordWalks[i][0];
        var cursor = wordWalks[i][1];
        console.log("\t#" + i + ", suggested word = \"" + word + "\"");
        console.log("\t\tcursor = " + cursor);
        //skip paths that overreach
        if (textDirection == "forward"){
            if ( word.endsWith("<>")
                 || (word.length > 1 && word.startsWith(">") && word.endsWith(">"))
               ){
                    console.log("\tskipping over-reaching forward path suggestion \"" + word + "\"");
                    continue;
            }
        } else if (textDirection == "reverse"){
            if ( word.startsWith("><")
                 || (word.length > 1 && word.startsWith("<") && word.endsWith("<"))
               ){
                    console.log("\tskipping over-reaching reverse path suggestion \"" + word + "\"");
                    continue;
                }
        }
        //create the suggestion list item
        var li = document.createElement("LI");                 // Create a <li> node
        li.setAttribute("word",word);
        li.setAttribute("cursor",cursor);
        //filter misdirected word termination markers from displayed words
        var dispWord = word;
        if (hide_backwards_termination_markers == true){
            console.log("\thiding backwards termination markers in word =  \"" + word + "\"");
            if (textDirection == "forward"){
                dispWord = word.replace(/[<]/g,""); //IMPORTANT replace all occurences with global regex
            } else if (textDirection == "reverse"){
                dispWord = word.replace(/[>]/g,""); //IMPORTANT replace all occurences with global regex
            } else{
                alert("WARNING: textDirection == " + textDirection + " is invalid!");
            }
        }
        var textNode = document.createTextNode(dispWord);        // Create a text node
        li.appendChild(textNode);                              // Append the text to <li>
        ul.appendChild(li);
    }
    //register a handler for the suggestion list item selection
    ul.onclick = function(event){
        //find the particular LI that was clicked
        var target = getEventTarget(event);
        if (target.nodeName == "LI"){ //prevents clicking on ul parent
            var parent = target.parentElement;
            var cursor = target.getAttribute('cursor');
            var word   = target.getAttribute('word');
            //get the textDirection of the parent UL container
            var UL_textDirection = parent.getAttribute("text-direction");
            //filter misdirected word termination markers
            var fWord = word.replace(/[<]/g,""); //IMPORTANT replace all occurences with global regex
            var rWord = word.replace(/[>]/g,""); //IMPORTANT replace all occurences with global regex
            console.log("clicked on \"" + word + "\" [" + cursor + "]");
            //add the word to the working palindrome
            var a1 = document.getElementById("forwardText");
            var a2 = document.getElementById("reverseText");
            if (UL_textDirection == "forward"){
                a1.textContent = a1.textContent + fWord;
                a2.textContent = reverseString(rWord) + a2.textContent;
            } else if (UL_textDirection == "reverse"){
                a1.textContent = a1.textContent + reverseString(fWord);
                a2.textContent = rWord + a2.textContent;
            }
            //update the palindrome space cursor and its display
            palindrome_space.cursor = cursor;
            var a = document.getElementById("psCursor");
            a.textContent = String(palindrome_space.cursor);
            var span = document.getElementById("workingPalindrome");
            if (palindrome_space.cursor == 0){
                span.setAttribute("class","completedPalindrome");
            } else{
                span.removeAttribute("class")
            }
            //continue at new cursor location
            showNextWords(palindrome_space);
        }
    };
}

function showNextWords(palindrome_space){
    console.log("showNextWords: palindrome_space.cursor = " + palindrome_space.cursor);
    var wordWalks = palindrome_space.nextWords();
    //add the forward word suggestions
    var ul1 = document.getElementById("forwardWordSuggestions");
    buildWordSuggestions(palindrome_space, ul1, wordWalks.fWalks);
    //add the reverse word suggestions
    var ul2 = document.getElementById("reverseWordSuggestions");
    buildWordSuggestions(palindrome_space, ul2, wordWalks.rWalks);
}
////////////////////////////////////////////////////////////////////////////////
// MAIN entry point
$( document ).ready(function() {
    console.log( "Document ready!" );
    //for local json file loading hack see: http://stackoverflow.com/questions/335409/jquery-getjson-firefox-3-syntax-error-undefined
    $.ajax({
      url: "data/MF1000.json",
      dataType: "json",
      mimeType: "text/plain",
      success: function(data){
        var ps = new PalindromeSpace(data);
        showNextWords(ps);
      }
    });
});
