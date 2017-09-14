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

window.addToggle = function() {
  // Find all dinosaurs whose height is exactly 25 meters.
  var user = firebase.auth().currentUser;
  var artistRef = firebase.database().ref("users/" + user.uid + "/artists");
  artistRef.orderByChild("artist").equalTo(window.artistName).on("value", function(snapshot) {
    if (snapshot.val()) {
      $("#add").remove();
      $("#add_text").text("Remove Artist");
      $("$#add_holder").prepend('<i id="remove" class="fa fa-minus-circle" aria-hidden="true"></i>');
    }
  });
}

var artistList = {
  list: [],
  addToList: function (artist) {
    this.list.push(artist);
    this.updateHTML();
  },
  deleteLI: function (artist) {
    var index = artistList.list.indexOf(artist);
    
    if(index != -1) {
      artistList.list.splice(index, 1);
    }

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
    if (error) {
      $("#errorPass").text(error.message);
      return false;
    }
  }).then(function(result) {
    if (result) {
      $(".after-form").show();
      $(".form-holder").hide();
    } else {
      $("#errorPass").text("Invalid email/password");
    }
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
  } else {
    $("#errorEmail").text("A valid email address is required.");
  }

  //validate password
  var rePass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  var is_pass =rePass.test(pass);
  if (is_pass) {
    true;
  } else {
    $("#errorPass").text("Password must be between 6-20 characters with at least one digit, one upper, and one lowercase character.");
  }

  if (is_pass && is_email) {
    // Sign in
    var promise = auth.createUserWithEmailAndPassword(email, pass).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    }).then(function(result) {
      if (result) {
        $(".after-form").show();
        $(".form-holder").hide();
      } else {
        return false;
      }
    });
  } 

  //clear input fields
  $("#txtEmail").val("");
  $("#txtPassword").val("");

});

//When there is a User logged in this handles sign out
$("#topCornerButton").on("click", "#sign-out", function(event) {
  $("#my_artists").hide();
  firebase.auth().signOut();
  $("#txtEmail").val("");
  $("#txtPassword").val("");  
});


$("#add").on("click", function(event) {
  var user = firebase.auth().currentUser;

  if (window.artistName) {
    
    if(artistList.list.indexOf(window.artistName) === -1) {

      artistList.addToList(window.artistName);

      firebase.database().ref('users/' + user.uid + '/artists').push({
        artist: window.artistName,
        imgURL: window.imgURL
      });
    }
  }
});

$("#delete").on("click", function(event) {
  var user = firebase.auth().currentUser;

  var ref = firebase.database().ref('users/' + user.uid + '/artists');
  ref.orderByChild("artist").equalTo(window.artistName).on("child_added", function(snapshot) {
    var item = firebase.database().ref('users/' + user.uid + '/artists/' + snapshot.key);
    item.remove().then(function(){
    }).catch(function(error) {
      return false;
    })
  });
  
});

//real time listener for if there is a change in User
firebase.auth().onAuthStateChanged(function(firebaseUser) {
  if(firebaseUser){

    $("#current-user").text(firebaseUser.email);
    $("#topCornerButton").html("<a href='' id='sign-out'>Log Out</a>");

    var user = firebase.auth().currentUser;

  } else {

    $("#topCornerButton").html("<a href='authentication.html'>Log In</a>");
    $("#current-user").text("");
    $("#sign-out").addClass('hide');

  }
});




