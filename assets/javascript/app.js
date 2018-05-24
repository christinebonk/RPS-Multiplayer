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
var playerOne = playersRef.child("1");
var playerTwo = playersRef.child("2");
var connectedRef = database.ref(".info/connected"); 
var thisPlayer 
var thisPlayer

  //Check if two players are in the game already


  //Create player object when user enters game
$("#submit-button").on("click", function(event) {
  event.preventDefault(); 

  //Create player object
  var playerName = $("#name").val().trim();
  player = {
    name: playerName,
    losses: 0,
    wins: 0
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
    } else {
      console.log("Too many players")
    }
  })
  
});

  //Collect choices of player
$(".choices").on("click", function(){
  var choice = $(this).attr("data");
  player.choice = choice;
  console.log(choice); 

  if(thisPlayer === 1 ){
    playerOne.set(player);
  } else if (thisPlayer === 2) {
    playerTwo.set(player);
  }
});

  //Rock paper scissors logic 

  //Create chat window 