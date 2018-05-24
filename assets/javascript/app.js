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
var thisPlayer; //holds whether current player is 1 or 2
var player; //player object
var playerOneChoice;
var playerTwoChoice;
var playerOneTurn = false;
var playerTwoTurn = false;

//Score
var playerOneWins = 0;
var playerOneLosses = 0;
var playerTwoWins = 0;
var playerTwoLosses = 0;



  //Create player object when user enters game
$("#submit-button").on("click", function(event) {
  event.preventDefault(); 

  //Create player object
  var playerName = $("#name").val().trim();
  player = {
    name: playerName,
    losses: 0,
    wins: 0,
    turn: false
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

  //collect choice
  var choice = $(this).attr("data");
  player.choice = choice;
  player.turn = true;
  console.log(choice); 

  //set choice in firebase
  if(thisPlayer === 1 ){
    playerOne.set(player);

  } else if (thisPlayer === 2) {
    playerTwo.set(player);
  }

  //update player turns
  function updateTurns() {

    //update player 1
    playerOne.once("value").then(function(snapshot) {
      playerOneTurn = snapshot.val().turn;

      //update player 2
        playerTwo.once("value").then(function(snapshot) {
            playerTwoTurn = snapshot.val().turn;
        });
    });
    
  };

  //check if players have taken their turns
  function checkTurns() {
    if (playerOneTurn && playerTwoTurn) {
      playerOne.once("value").then(function(snapshot) {
        playerOneChoice = snapshot.val().choice;
      });
      playerTwo.once("value").then(function(snapshot) {
        playerTwoChoice = snapshot.val().choice;
      });
      setTimeout(gameLogic,1000);
    }
  }

  updateTurns();
  setTimeout(checkTurns,1000);




});

  //determine if both players have taken turn
  
  



  // .then(gameLogic());

    // if (playerOneTurn && playerTwoTurn) {
    // playerOne.once("value").then(function(snapshot) {
    //   playerOneChoice = snapshot.val().choice;
    // })
    // playerTwo.once("value").then(function(snapshot) {
    //   playerTwoChoice = snapshot.val().choice;
    // });

  //   setTimeout(gameLogic, 5000);

  // }

  // })



  

// });

  //Retrive choice of player
// playerOne.on("value", function(snapshot) {
//   //check if player has chosen answer
//   if(snapshot.child("choice").exists()) {
//     playerOneChoice = snapshot.val().choice;
//   };
//   //check if opponent and player have chosen answer
//   if (playerOneChoice && playerTwoChoice) {
//     gameLogic();
//   }
// })

// playerTwo.on("value", function(snapshot) {
//   //check if player has chosen answer
//   if(snapshot.child("choice").exists()) {
//     playerTwoChoice = snapshot.val().choice;
//   }
//   //check if opponent and player have chosen answer
//   if (playerOneChoice && playerTwoChoice) {
//     gameLogic();
//   }
// })

  //Rock paper scissors logic 
var gameLogic = function() {
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

  console.log(playerOneChoice);
  console.log(playerTwoChoice);

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