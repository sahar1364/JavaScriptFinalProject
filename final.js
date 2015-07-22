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
    
    /*
        Starts the game by creating all the Memory objects, showing the values for a few seconds and then hiding them from the user
    */
    function startGame() {
        numberArray = [];
        for (var i=0; i < level+1; i++) {
            numberArray.push(new MemoryNumber(i+1));
            try {
                var pos = generatePosition();
                numberArray[i].setPosition(pos.x, pos.y);
            } catch(e) {
                alert("A technical error happend, please refresh the page");
            }
        }
        setTimeout(makeAllVisible, 3000);
        setTimeout(makeAllHidden, 3000 + level*1000);    
    }
    
    /*
        creates all the elements for the DOM which represent the game
        @return: the main div for the game (gameDiv)
    */
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
    
    /*
      Removes all the elements related to the game from the DOM  
    */
    function removeCurrentLevelElementsFromPage() {
        document.body.removeChild(gameDiv);
        document.body.removeChild(quitButton);
        document.body.removeChild(levelDiv);        
    }
    
    /*
        Checks the game state when a click happens to see whether the game is finished or not
        and goes to next level if the game is finished
    */
    function checkGameState() {
        var isGameFinished = true;
        var orderIsCorrect = false;
        for (var i = 0; i < numberArray.length; i++) {
            if (!numberArray[i].getIsClicked()) {
                isGameFinished = false;
            }
            else if (numberArray[i].getIsClicked() && isOutOfOrder(i)) {
                numberArray[i].gotItWrong(numberArray[i].getDiv());   
            }
        }
        if (isGameFinished) {
            setTimeout(goToNextLevel, 3000);
        }
        //checks if the iVar th element in the numberArray has been clicked out of order
        function isOutOfOrder(iVar) {
            for (var j = 0; j < iVar; j++) {
                if (!numberArray[j].getIsClicked()) {
                    return true;
                }
            }
            return false;
        }
    }
    
    /*
        Takes you to next level if you got all the numbers right in order, otherwise restarts the same level
    */
    function goToNextLevel() {
        if (canGoToNextlevel()) {
            level = level + 1;
        }
        
        removeCurrentLevelElementsFromPage();
       
        gameDiv = createGameDiv();
        startGame();
        
        function canGoToNextlevel() {
            for (var i = 0; i < numberArray.length; i++) {
                if (!numberArray[i].clickedOnTime) {
                    return false;
                }
            }
            return true;
        }
    }
    
    /*
        Makes all the numbers visible on the page
    */
    function makeAllVisible() {
        for (var i = 0; i < numberArray.length; i++) {
            numberArray[i].setVisible(numberArray[i].getDiv());
        }
    }
    
    /*
        Hides all the numbers from the user on the page
    */
    function makeAllHidden() {
         for (var i = 0; i < numberArray.length; i++) {
            numberArray[i].setHidden(numberArray[i].getDiv());
        }       
    }
    
    /*
        Each number is an object on the div which can be constructed by passing a value in
    */
    function MemoryNumber(val) {
        //private variables
        var x  = 0;
        var y = 0;
        var value = val;
        var div;
        var isClicked = false;
        
        //public variables and method
        this.clickedOnTime = true;

        this.getIsClicked = function() {
            return isClicked;   
        };
        this.setPosition = function(xPos, yPos) {
            if (!isNaN(xPos) && !isNaN(yPos) && xPos <= GAME_DIV_WIDTH && yPos <= GAME_DIV_HEIGHT) {
                x = xPos;
                y = yPos;
                createDiv();
            }
            else {
                throw new Error("Generated random numbers are not correct");
            }
        };
        this.getValue = function() {
            return value;
        };
        this.getDiv = function() {
            return div;
        }
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
    }
    
    //set some common methods on protoptype to avoid extra memory usage
    MemoryNumber.prototype.gotItWrong = function(div) {
        div.setAttribute("class", "number visible wrong-guess");
        this.clickedOnTime = false;    
    }
    MemoryNumber.prototype.gotItRight = function (div) {
        div.setAttribute("class", "number visible right-guess");
        this.clickedOnTime = true;
    };
    MemoryNumber.prototype.setVisible = function (div) {
        div.setAttribute("class","number visible"); 
    };
    MemoryNumber.prototype.setHidden = function (div) {
        div.setAttribute("class","number hidden"); 
    };
    
    /*
      Generates a random position on the plane
      @return: an object containing x and y positions
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
    
    /* uses closure for the variables that are not in the scope and returns a public API for use*/
    return {
        /*
          @input: the id of the div for the start page
          @input: the id of the start button
        */
        start: function(div1, startId) {
            var play = document.getElementById(startId);
            play.onclick = function() {
                construct(div1);
            };
        },
    };
    
})();