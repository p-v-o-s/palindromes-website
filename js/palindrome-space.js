function reverseString(str) {
    return str.split("").reverse().join("");
}

var PalindromeSpace = function PalindromeSpace(graphData){
    this.graph = graphData;
    this.cursor = 0;
}

PalindromeSpace.prototype.nextWords = function(cursor){
    if (cursor === undefined){
        cursor = this.cursor;
    }
    var word = "";
    var workingWalks = [[cursor,word]];
    var finishedForwardWalks = [];
    var finishedReverseWalks = [];
    while(true) {
        var walk = workingWalks.pop();
        if (walk === undefined){
            return {'fWalks': finishedForwardWalks,
                    'rWalks': finishedReverseWalks,
                   };
        }
        cursor = walk[0];
        word   = walk[1];
        //get the node in the graph
        var node = this.graph[cursor];
        var markers = Object.keys(node);
        console.log("At node " + cursor + " available markers: " + markers);
        for (var i = 0; i < markers.length; i++){
            var marker = markers[i];
            var newCursor = node[marker];
            var newWord = word.concat(marker);
            console.log("Continuing walk at ", cursor, "\"" + word + "\" next marker \"" + marker + "\"");
            if (marker == ">"){
                console.log("Saving forward walk \"" + newWord + "\" -> " + newCursor);
                finishedForwardWalks.push([newWord,newCursor]);
            } else if (marker == "<"){
                //we want to bias the suggestions in favor of forward word completions
                //so continue the walk after any reverse terminations
                var revWord = reverseString(newWord);
                console.log("Saving reverse walk \"" + revWord + "\" -> " + newCursor);
                finishedReverseWalks.push([revWord,newCursor]);
                workingWalks.push([newCursor,newWord]);
            } else{
                console.log("adding marker:",marker);
                //descend down this marker's edge
                console.log("going down to ",newCursor);
                workingWalks.push([newCursor,newWord]);
            }
        }
    }
}

// TEST SET: ['race;, 'car','said', 'i','as']
//var ps = new PalindromeSpace([
//{"i":24,"r":7,"s":16},
//{"c":12},
//{"<":0},
//{"i":23},
//{"a":25},
//{"<":0},
//{"<":0},
//{"a":8},
//{"c":10},
//{"e":11},
//{"<":9},
//{">":1},
//{"a":13},
//{"r":15},
//{">":0},
//{"<":14,">":2},
//{"a":18},
//{"i":20},
//{"<":17},
//{"d":21},
//{"<":19},
//{">":3},
//{">":0},
//{">":4},
//{"<":22,">":6},
//{"s":27},
//{">":0},
//{"<":26,">":5}
//]);
