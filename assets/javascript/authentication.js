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

var artistList = {
  list: [],
  addToList: function (artist) {
    this.list.push(artist);
    this.updateHTML();
  },
  deleteLI: function (artist) {
    console.log(artist);
    var index = artistList.list.indexOf(artist);

    console.log(artistList.list);
    
    if(index != -1) {
      artistList.list.splice(index, 1);
    }

    console.log(artistList.list);

    // for (var i = 0; i < artistList.list; i++) {
    //   if (artist == artistList.list[i]) {
    //     this.list.splice(i, 1);
    //   }
    // }
    this.updateHTML();
  },
  toString: function () {
    return this.list.map(encodeURIComponent).join(',');
  },
  updateList: function (string) {
    this.list = string.split(',').map(decodeURIComponent);
    this.updateHTML();
  },
  toHTML: function () {
    return (
      this.list.length
        ? ('<li>' + this.list.join('</li><li>') + '</li>')
        : ''
    );
  },
  updateHTML: function () {
    $('#current-user').html('<ul>' + this.toHTML() + '</ul>');
  }
};

//sign in event
$("#sign-in").on("click", function(event) {
  event.preventDefault();
  //get email and pass
  var email = txtEmail.val();
  var pass = txtPassword.val();

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
  var email = txtEmail.val();
  var pass = txtPassword.val();

  var auth = firebase.auth();

  //validates EMAIL input
  var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var is_email=re.test(email);
  if (is_email) {
    true;
    console.log("loss");
  } else {
    $("#error").text("A valid email address is required");
    console.log("win");
  }

  // Sign in
  var promise = auth.createUserWithEmailAndPassword(email, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  //clear input fields
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

  if (window.artistName) {
    
    if(artistList.list.indexOf(window.artistName) === -1) {

      artistList.addToList(window.artistName);

      firebase.database().ref('users/' + user.uid).set({
        artist: artistList.toString()
      });
    }
  }
});

$("#delete").on("click", function(event) {
  var user = firebase.auth().currentUser;

  artistList.deleteLI(window.artistName);

  firebase.database().ref('users/' + user.uid).set({
    artist: artistList.toString()
  });
  console.log("delete");
})

//real time listener for if there is a change in User
firebase.auth().onAuthStateChanged(function(firebaseUser) {
  if(firebaseUser){
    console.log(firebaseUser.email);
    $("#current-user").text(firebaseUser.email);
    $("#topCornerButton").html("<a href='' id='sign-out'>Log Out</a>");

    var user = firebase.auth().currentUser;

    firebase.database().ref('users/' + user.uid).on("value", function(snapshot) {
      artistList.updateList(snapshot.val().artist);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  } else {
    console.log("not logged in")
    $("#current-user").text("");
    $("#sign-out").addClass('hide');
  }
});




