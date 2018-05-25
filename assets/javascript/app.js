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

//Variables

//FB DB 
var database = firebase.database();
var playersRef = database.ref("/players");
var playerOne = playersRef.child("one");
var playerTwo = playersRef.child("two");
var connectedRef = database.ref(".info/connected"); 
var connectionsRef = database.ref("/connections");
var turnRef = database.ref("/turn");
var thisPlayerRef

//Other Variables
var turnCount = 0;
var thisPlayer; //holds whether current player is 1 or 2
var player; //player object
var playerOneChoice;
var playerTwoChoice;
var playerOneName
var playerTwoName
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
      $("#welcome-screen").addClass("remove");
      $("#headline").text("Hi " + playerOneName + "! Waiting for another player to join.");
      $("#player1-name").text(playerOneName);
    } else if (numPlayers === 1) {
      console.log("player 2")
      thisPlayer = 2;
      playerTwo.set(player);
      turnCount++
      turnRef.set(turnCount)
      $("#welcome-screen").addClass("remove");
      $("#player1-name").text(playerOneName);
      $("#player2-name").text(playerTwoName);  
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
    $("#headline").text("It's not your turn");
    console.log("It is not your turn")
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
  }
  if(snapshot.child("choice").exists()) {
    playerTwoChoice = snapshot.val().choice;
  };
});



    
//listener for turns 
turnRef.on("value", function(snapshot) {
  turnCount = snapshot.val();
  if (turnCount === 0) {

  } else if (turnCount === 1) {
    $("#player2-choices").empty();
    $("#headline").text("It is " + playerOneName + "'s turn!");
    for(i=0;i<choices.length;i++) {
      var newChoice = $("<div class='choices'>" + choices[i] + "</div>");
      newChoice.attr("data", choices[i]);
      $("#player1-choices").append(newChoice);
    }
  } else if (turnCount === 2) {
    $("#headline").text("It is " + playerTwoName + "'s turn!");
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

  if (playerOneChoice === playerTwoChoice) {
    console.log("tie");
    $("#headline").text(playerOneName + " and " + playerTwoName + " Tie!");
  } else if (playerOneChoice === "rock" && playerTwoChoice === "scissor") {
    console.log("player one wins");
    $("#headline").text(playerOneName + " takes this round!")
    playerOneWins ++
    playerTwoLosses ++
  } else if (playerOneChoice === "scissor" && playerTwoChoice === "paper") {
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
    $("#headline").text(playerTwoName + " takes this round!")
    playerOneLosses ++
    playerTwoWins ++
  }

  //reset turn count
  turnCount = 1;
  turnRef.set(turnCount);

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

}

//discounnect player 
// var con 

connectedRef.on("value",function(snapshot){
  if(snapshot.val()) {
    playerOne.onDisconnect().remove();
    playerTwo.onDisconnect().remove();
  }
});



// connectedRef.on("value",function(snapshot){
//   if(snapshot.val()) {
//     var con = connectionsRef.push(true);
//     con.onDisconnect().remove();
//   }
// });

  //Create chat window 