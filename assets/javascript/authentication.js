var config = {
  apiKey: "AIzaSyCl1Kg-K4RjDdCaA7RwVEau-U3_Y4pfQt4",
  authDomain: "authtest-9384a.firebaseapp.com",
  databaseURL: "https://authtest-9384a.firebaseio.com",
  projectId: "authtest-9384a",
  storageBucket: "authtest-9384a.appspot.com",
  messagingSenderId: "639846921255"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

//get elements
var txtEmail = $("#txtEmail");
var txtPassword = $("#txtPassword");

//sign in event
$("#sign-in").on("click", function(event) {
  event.preventDefault();
  //get email and pass
  var email = txtEmail.val();
  var pass = txtPassword.val();

  console.log(email);
  console.log(pass);

  var auth = firebase.auth();
  // Sign in
  var promise = auth.signInWithEmailAndPassword(email, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  //get user data from database

  $("#txtEmail").val("");
  $("#txtPassword").val("");
});

//sign up event
$("#sign-up").on("click", function(event) {
  event.preventDefault();
  //get email and pass
  //TODO: Check for real emails
  var email = txtEmail.val();
  var pass = txtPassword.val();
  var auth = firebase.auth();
  // Sign in
  var promise = auth.createUserWithEmailAndPassword(email, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
  $("#txtEmail").val("");
  $("#txtPassword").val("");
});

//When there is a User logged in this handles sign out
$("#topCornerButton").on("click", "#sign-out", function(event) {
  firebase.auth().signOut();
  $("#txtEmail").val("");
  $("#txtPassword").val("");  
});

//TODO: capture Users search input and push it to users artist property
$("#add").on("click", function(event) {
  var user = firebase.auth().currentUser;
  console.log(user);
  firebase.database().ref('users/' + user.uid).set({
    artist: 'bach'
  });
});

//real time listener for if there is a change in User
firebase.auth().onAuthStateChanged(function(firebaseUser) {
  if(firebaseUser){
    console.log(firebaseUser.email);
    $("#current-user").text(firebaseUser.email);
    $("#topCornerButton").html("<a href='' id='sign-out'>Log Out</a>");
  } else {
    console.log("not logged in")
    $("#current-user").text("No User");
    $("#sign-out").addClass('hide');
  }
});






