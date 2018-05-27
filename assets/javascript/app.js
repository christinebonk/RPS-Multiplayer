// Initialize Firebase
var config = {
  apiKey: "AIzaSyCpviKj2rCDiIAzDmQ9FbmwYWbnYJLNhjY",
  authDomain: "rps-multiplayer-8d9ba.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-8d9ba.firebaseio.com",
  projectId: "rps-multiplayer-8d9ba",
  storageBucket: "",
  messagingSenderId: "463753495711"
};
firebase.initializeApp(config);

//FB DB 
var database = firebase.database();
var playersRef = database.ref("/players");
var chat = database.ref("/chat");
var playerOne = playersRef.child("one");
var playerTwo = playersRef.child("two");
var connectedRef = database.ref(".info/connected"); 
var connectionsRef = database.ref("/connections");
var turnRef = database.ref("/turn");

//Game Variables
var turnCount = 0;
var thisPlayer; //holds whether current player is 1 or 2
var player; //player object
var playerOneChoice;
var playerTwoChoice;
var playerOneName
var playerTwoName
var choices = ["rock", "paper", "scissors"];
var images = {
  rock: "images/rock.png",
  paper: "images/paper.png",
  scissors: "images/scissors.png"
};

//Score
var playerOneWins = 0;
var playerOneLosses = 0;
var playerTwoWins = 0;
var playerTwoLosses = 0;

//set turn to 0
turnRef.set(turnCount);

//Create player object when user enters game
$("#submit-button").on("click", function(event) {
  event.preventDefault(); 

  //Create player object
  var playerName = $("#name").val().trim();
  player = {
    name: playerName,
    losses: 0,
    wins: 0,
  }

  //Push player to firebase
  playersRef.once("value").then(function(snapshot) {
    var numPlayers = snapshot.numChildren();
    //set up player 1
    if (numPlayers === 0) {
      console.log("player 1");
      thisPlayer = 1;
      playerOne.set(player);
      playerOne.onDisconnect().remove();
      $("#welcome-screen").addClass("remove");
      $("#headline").text("Hi " + playerOneName + "! Waiting for another player to join.");
      $("#player1-name").text(playerOneName + " (you)");
    //set up player 2
    } else if (numPlayers === 1) {
      console.log("player 2")
      thisPlayer = 2;
      playerTwo.set(player);
      playerTwo.onDisconnect().remove();
      turnCount++
      turnRef.set(turnCount)
      $("#welcome-screen").addClass("remove");
      $("#player1-name").text(playerOneName);
      $("#player2-name").text(playerTwoName + " (you)");  
    //stop if too many players
    } else {
      $("#intro").text("Too many players in the game");
    }   
  })
});

//Collect choices of player
$("body").on("click", ".choices", function(){
  if (turnCount === thisPlayer) {
    //collect choice
    var choice = $(this).attr("data");
    player.choice = choice;
    turnCount++;
    turnRef.set(turnCount);
    //set choice in firebase
    if(thisPlayer === 1 ){
      playerOne.set(player);
      var createImage = assignImage(choice);
      $("#player1-choices").html(createImage);
    } else if (thisPlayer === 2) {
      playerTwo.set(player);
    }
  } else {
    $("#headline").text("It's not your turn");
  }   
});

//listener for changes to players
playerOne.on("value", function(snapshot) {
  if(snapshot.child("name").exists()) {
    playerOneName = snapshot.val().name;
  }

  if(snapshot.child("choice").exists()) {
    playerOneChoice = snapshot.val().choice;   
  };

});

playerTwo.on("value", function(snapshot) {
  if(snapshot.child("name").exists()) {
    playerTwoName = snapshot.val().name;
      if(thisPlayer === 1) {
        $("#player2-name").text(playerTwoName);  
      }
  }

  if(snapshot.child("choice").exists()) {
    playerTwoChoice = snapshot.val().choice;
    var createImage = assignImage(playerTwoChoice);
    $("#player2-choices").html(createImage);
    var createImage2 = assignImage(playerOneChoice);
      $("#player1-choices").html(createImage2);
  };

});


function assignImage(choice) {
  var newImage;
  if (choice == "rock") {
    newImage = $("<img src='assets/images/rock.png' alt='rock'>"); 
  } else if (choice == "paper") {
    newImage = $("<img src='assets/images/paper-plane.png' alt='paper'>"); 
  } else if (choice == "scissors") {
    newImage = $("<img src='assets/images/scissors.png' alt='scissors'>"); 
  }

  return newImage;
}


    
//listener for turns 
turnRef.on("value", function(snapshot) {
  turnCount = snapshot.val();
  if (turnCount === 0) {
    

    //Define actions on turn 1
  } else if (turnCount === 1) {
    //Update score
    $("#player1-wins").text("Wins: " + playerOneWins);
    $("#player2-wins").text("Wins: " + playerTwoWins);
    $("#player1-losses").text("Losses: " + playerOneLosses);
    $("#player2-losses").text("Losses: " + playerTwoLosses);
    //
    $("#headline").text("It is " + playerOneName + "'s turn!");
    $("#player1-choices").empty();
    $("#player2-choices").empty();
    for(i=0;i<choices.length;i++) {
      var newChoice = $("<div class='choices circles'>" + choices[i] + "</div>");
      newChoice.attr("data", choices[i]);
      $("#player1-choices").append(newChoice);
    }
    for(i=0;i<choices.length;i++) {
      var newChoice = $("<div class='circles grey'>" + choices[i] + "</div>");
      $("#player2-choices").append(newChoice);
    }

    //Define actions on turn 2
  } else if (turnCount === 2) {
    $("#headline").text("It is " + playerTwoName + "'s turn!");
    $("#player1-choices").empty();
    $("#player2-choices").empty();
    for(i=0;i<choices.length;i++) {
      var newChoice = $("<div class='choices circles'>" + choices[i] + "</div>");
      newChoice.attr("data", choices[i]);
      $("#player2-choices").append(newChoice);
    }
    for(i=0;i<choices.length;i++) {
      var newChoice = $("<div class='circles grey'>" + choices[i] + "</div>");
      $("#player1-choices").append(newChoice);
    }

    //Define actions on turn 3
  } else if (turnCount === 3) {
    setTimeout(gameLogic,1000);
  }
});


  //Rock paper scissors logic 
var gameLogic = function() {

  if (playerOneChoice === playerTwoChoice) {
    console.log("tie");
    $("#headline").text(playerOneName + " and " + playerTwoName + " Tie!");
  } else if (playerOneChoice === "rock" && playerTwoChoice === "scissors") {
    console.log("player one wins");
    $("#headline").text(playerOneName + " takes this round!")
    playerOneWins ++
    playerTwoLosses ++
  } else if (playerOneChoice === "scissors" && playerTwoChoice === "paper") {
    console.log("player one wins");
    $("#headline").text(playerOneName + " takes this round!")
    playerOneWins ++
    playerTwoLosses ++
  } else if (playerOneChoice === "paper" && playerTwoChoice === "rock") {
    console.log("player one wins");
    $("#headline").text(playerOneName + " takes this round!")
    playerOneWins ++
    playerTwoLosses ++
  } else {
    console.log("player two wins");
    $("#headline").text(playerTwoName + " gets it this time!")
    playerOneLosses ++
    playerTwoWins ++
  }

  

 
  
  //update player score
  if(thisPlayer === 1 ){
    player.wins = playerOneWins;
    player.losses = playerOneLosses;
    playerOne.set(player);
  } else if (thisPlayer === 2) {
    player.wins = playerTwoWins;
    player.losses = playerTwoLosses;
    playerTwo.set(player);
  }

  //reset turn count
   setTimeout(function(){
    turnCount = 1;
    turnRef.set(turnCount);

  }, 6000)

}

//Create chat window
chat.child("chat2").remove();
chat.child("chat1").remove();

$("#chat-header").on("click", function(){
  $("#chat").toggleClass("up");
})

$("#chat-button").on("click", function(event) {
  event.preventDefault();
  var message = $("#chat-input").val().trim();
  $("#chat-input").val("");
  if(thisPlayer === 1) {
    chat.child("chat1").set(message);
  } else if (thisPlayer === 2) {
    chat.child("chat2").set(message);
  } 
});

chat.child("chat1").on("value", function(snapshot) {
  if(snapshot.exists()) {
    console.log("hi")
    var newMessage = snapshot.val();
    var newList = $("<p>");
    newList.text(playerOneName + ": " + newMessage);
    $("#chat-display").append(newList);
  } 
});

chat.child("chat2").on("value", function(snapshot) {
  if(snapshot.exists()) {
    var newMessage = snapshot.val();
    var newList = $("<p>");
    newList.text(playerTwoName + ": " + newMessage);
    $("#chat-display").append(newList);
  }
})
