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

var database = firebase.database();

var playersRef = database.ref("/players");
var playerOne = playersRef.child("one");
var playerTwo = playersRef.child("two");
var connectedRef = database.ref(".info/connected"); 
var turnRef = database.ref("/turn");
var turnCount = 0;
var thisPlayer; //holds whether current player is 1 or 2
var player; //player object
var playerOneChoice;
var playerTwoChoice;
var choices = ["rock", "paper", "scissors"];

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
    if (numPlayers === 0) {
      console.log("player 1");
      thisPlayer = 1;
      playerOne.set(player);
    } else if (numPlayers === 1) {
      console.log("player 2")
      thisPlayer = 2;
      playerTwo.set(player);
      turnCount++
      turnRef.set(turnCount)
    } else {
      console.log("Too many players")
    }
  })
  
});

//Collect choices of player
$("body").on("click", ".choices", function(){

  if (turnCount === thisPlayer) {
    //collect choice
    var choice = $(this).attr("data");
    player.choice = choice;
    console.log(choice); 
    turnCount++;
    turnRef.set(turnCount);

    //set choice in firebase
    if(thisPlayer === 1 ){
      playerOne.set(player);
    } else if (thisPlayer === 2) {
      playerTwo.set(player);
    }

  } else {
    console.log("It is not your turn")
  }
    
});

//listener for choices
playerOne.on("value", function(snapshot) {
  if(snapshot.child("choice").exists()) {
    console.log("1+: " + snapshot.val().choice);
    playerOneChoice = snapshot.val().choice;
  };
});

playerTwo.on("value", function(snapshot) {
  if(snapshot.child("choice").exists()) {
    console.log("2+: " + snapshot.val().choice);
    playerTwoChoice = snapshot.val().choice;
  };
});

//listener for turns 
turnRef.on("value", function(snapshot) {
  turnCount = snapshot.val();
  if (turnCount === 0) {

  } else if (turnCount === 1) {
    $("#player2-choices").empty();
    for(i=0;i<choices.length;i++) {
      var newChoice = $("<div class='choices'>" + choices[i] + "</div>");
      newChoice.attr("data", choices[i]);
      $("#player1-choices").append(newChoice);
    }
  } else if (turnCount === 2) {
    $("#player1-choices").empty();
    for(i=0;i<choices.length;i++) {
      var newChoice = $("<div class='choices'>" + choices[i] + "</div>");
      newChoice.attr("data", choices[i]);
      $("#player2-choices").append(newChoice);
    } 
  } else if (turnCount === 3) {
    setTimeout(gameLogic,1000);
  }
});



  

  //Rock paper scissors logic 
var gameLogic = function() {
  console.log("1: " + playerOneChoice);
  console.log("2: " + playerTwoChoice);
  if (playerOneChoice === playerTwoChoice) {
    console.log("tie");
  } else if (playerOneChoice === "rock" && playerTwoChoice === "scissor") {
    console.log("player one wins");
    playerOneWins ++
    playerTwoLosses ++
  } else if (playerOneChoice === "scissor" && playerTwoChoice === "paper") {
    console.log("player one wins");
    playerOneWins ++
    playerTwoLosses ++
  } else if (playerOneChoice === "paper" && playerTwoChoice === "rock") {
    console.log("player one wins");
    playerOneWins ++
    playerTwoLosses ++
  } else {
    console.log("player two wins");
    playerOneLosses ++
    playerTwoWins ++
  }

  turnCount = 1;
  turnRef.set(turnCount);


  //set choice in firebase
  if(thisPlayer === 1 ){
    player.wins = playerOneWins;
    player.losses = playerOneLosses;
    playerOne.set(player);
  } else if (thisPlayer === 2) {
    player.wins = playerTwoWins;
    player.losses = playerTwoLosses;
    playerTwo.set(player);
  }

}

//update player score

//repeat game

  //Create chat window 