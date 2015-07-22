//Note: This project is implemented in pure JavaScript and no library is used
//using module pattern here so that the number of global variables is minimized and also
//we don't want to let the user construct more Game objects
var Game = (function () {
    "use strict";
    
    var level = 1;
    var numberArray = [];
    var gameDiv;
    var quitButton;
    var levelDiv;
    var startDiv;
    var GAME_DIV_WIDTH = 555;
    var GAME_DIV_HEIGHT = 555;
    
    function construct(div1) {
        startDiv = div1;
        document.getElementById(div1).style.display = "none";
        gameDiv = createGameDiv();
        startGame();
    }
    
    function startGame() {
        numberArray = [];
        for (var i=0; i < level+1; i++) {
            numberArray.push(new MemoryNumber(i+1));
            var pos = generatePosition();
            numberArray[i].setPosition(pos.x, pos.y);
        }
        setTimeout(makeAllVisible, 3000);
        setTimeout(makeAllHidden, 3000 + level*1000);    
    }
    
    function createGameDiv() {      
        quitButton = document.createElement("input");
        quitButton.setAttribute("type", "button");
        quitButton.setAttribute("class", "quit-button");
        quitButton.setAttribute("value", "Quit");
        
        var div = document.createElement("div");
        div.setAttribute("class", "game");
        div.onclick = checkGameState;
        
        levelDiv = document.createElement("div");
        levelDiv.setAttribute("class", "level");
        levelDiv.innerHTML = "Level: " + level;
        
        document.body.appendChild(levelDiv);
        document.body.appendChild(div);
        document.body.appendChild(quitButton);
        
        quitButton.onclick = function() {
            level = 1;
            numberArray = [];
            removeCurrentLevelElementsFromPage();
            document.getElementById(startDiv).style.display = "block";
        };
        
        return div;
    }
    
    function removeCurrentLevelElementsFromPage() {
        document.body.removeChild(gameDiv);
        document.body.removeChild(quitButton);
        document.body.removeChild(levelDiv);        
    }
    
    function checkGameState() {
        var isGameFinished = true;
        var orderIsCorrect = false;
        for (var i = 0; i < numberArray.length; i++) {
            if (!numberArray[i].getIsClicked()) {
                isGameFinished = false;
            }
            else if (numberArray[i].getIsClicked() && isOutOfOrder(i)) {
                numberArray[i].gotItWrong();   
            }
        }
        if (isGameFinished) {
            setTimeout(goToNextLevel, 3000);
        }
        function isOutOfOrder(iVar) {
            for (var j = 0; j < iVar; j++) {
                if (!numberArray[j].getIsClicked()) {
                    return true;
                }
            }
            return false;
        }
    }
    
    function goToNextLevel() {
        if (canGoToNextlevel()) {
            level = level + 1;
        }
        removeCurrentLevelElementsFromPage();
       
        gameDiv = createGameDiv();
        startGame();
        
        function canGoToNextlevel() {
            for (var i = 0; i < numberArray.length; i++) {
                if (!numberArray[i].getClickedOnTime()) {
                    return false;
                }
            }
            return true;
        }
    }
    
    function makeAllVisible() {
        for (var i = 0; i < numberArray.length; i++) {
            numberArray[i].setVisible();
        }
    }
    
    function makeAllHidden() {
         for (var i = 0; i < numberArray.length; i++) {
            numberArray[i].setHidden();
        }       
    }
    
    function MemoryNumber(val) {
        var x  = 0;
        var y = 0;
        var value = val;
        var div;
        var clickedOnTime = true;
        var isClicked = false;
        
        this.getClickedOnTime = function() {
            return clickedOnTime;
        };
        this.getIsClicked = function() {
            return isClicked;   
        };
        this.setPosition = function(xPos, yPos) {
            x = xPos;
            y = yPos;
            createDiv();
        };
        this.getValue = function() {
            return value;
        };
        this.gotItRight = function () {
            div.setAttribute("class", "number visible right-guess");
            clickedOnTime = true;
        };
        this.setVisible = function () {
            div.setAttribute("class","number visible"); 
        };
        this.setHidden = function () {
            div.setAttribute("class","number hidden"); 
        };
        this.gotItWrong = function () {
            div.setAttribute("class", "number visible wrong-guess");
            clickedOnTime = false;
        };
        
        function createDiv() {
            div = document.createElement("div");
            div.setAttribute("class", "number hidden");
            div.style.left = x + "px";
            div.style.top = y + "px";
            div.innerHTML = value;
            gameDiv.appendChild(div);
            div.onclick = function() {
                div.setAttribute("class","number visible");
                isClicked = true;
            };
        }
        function destroyDiv() {
            document.removeChild(div);    
        }
    }
    /*
      Generates a random position on the plane
    */
    function generatePosition() {
        var x = Math.floor(Math.random()*GAME_DIV_WIDTH);
        var y = Math.floor(Math.random()*GAME_DIV_HEIGHT);
        return {x, y};
    }
    /* Takes the user to the next level */
    function loadNextLevel() {
        level = level + 1;
        construct();
    }
    
    /* uses closure for the variables that are not in the scope and returns a public API*/
    return {
        start: function(div1, startId) {
            var play = document.getElementById(startId);
            play.onclick = function() {
                construct(div1);
            };
        },
    };
    
})();