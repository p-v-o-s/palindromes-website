var nextWordsButton = document.getElementById("nextWordsButton");
nextWordsButton.onclick = function(){
    var words = ps.nextWords();
    var wordsListElm = document.getElementById("wordsList");
    wordsListElm.innerHTML = ""; //blank out list
    for (var i = 0; i < words.length; i++){
        var node = document.createElement("LI");                 // Create a <li> node
        var textnode = document.createTextNode(words[i]);        // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        wordsListElm.appendChild(node);
    }
};
