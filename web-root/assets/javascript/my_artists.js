$(function() { 

  window.artistList = [];

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

  // true if the artists have already been displayed from firebase
  window.displayedOnce = false;

  function appendArtist(name, url) {
    var $artistHolder = $("<div>");
    $artistHolder.addClass("artist-holder");

    var $img = $("<img>");
    $img.attr("src", url).addClass("my-artist-image");

    var $artistName = $("<h5>");
    $artistName.text(name);

    $artistHolder.append($img, [$artistName]);
    $("#artist_icons").append($artistHolder);

  }

  //real time listener for if there is a change in User
  firebase.auth().onAuthStateChanged(function(firebaseUser) {

    if (firebaseUser) {

    var user = firebase.auth().currentUser;
    window.currentUser = user;

      if(!(window.displayedOnce)) {

        window.displayedOnce = true;

      	// $("#info").hide();
      	$("#current-user").text(firebaseUser.email);
        $("#topCornerButton").html("<a href='' id='sign-out'>Log Out</a>");

        $("#my_artists").show();

        firebase.database().ref('users/' + user.uid + '/artists').on("child_added", function(snapshot) {
          var userArtist = (snapshot.val());
          appendArtist(userArtist.artist, userArtist.imgURL);
          window.artistList.push(userArtist.artist);
        });

      } else {
        return false;
      }
    
    } else {
    	$("#info").hide().delay(100).show();
      $("#topCornerButton").html("<a href='authentication.html' id='sign-out'>Log In</a>");
    }

  });


  //When there is a User logged in this handles sign out
  $("#topCornerButton").on("click", "#sign-out", function(event) {
    firebase.auth().signOut(); 
  });

  $("body").on("click", ".add", function(event) {

    var user = firebase.auth().currentUser;
    $(this).removeClass("flipInX");

    if (window.artistName) {

      var ref = firebase.database().ref("users/" + user.uid + "/artists");
      ref.orderByChild("artist").equalTo(window.artistName).once("value", function(snapshot) {
        if (snapshot.val()) {
          return false;
        } else {
          firebase.database().ref('users/' + user.uid + '/artists').push({
            artist: window.artistName,
            imgURL: window.imgURL
          }).then(function() {
            window.artistList.push(window.artistName);
            $("#add_holder").removeClass("add");
            $("#add_holder").addClass("remove");
            $("#add_text").text("Remove");
            $("#add").removeClass("fa-plus");
            $("#add").addClass("fa-times");
            $("#add_holder").addClass("fadeIn");
          });
          
        }
      });


    }

  });

  $("body").on("click", ".remove", function(event) {
    var user = firebase.auth().currentUser;
    $(this).removeClass("fadeIn");

    var ref = firebase.database().ref('users/' + user.uid + '/artists');
    ref.orderByChild("artist").equalTo(window.artistName).once("child_added", function(snapshot) {
      var item = firebase.database().ref('users/' + user.uid + '/artists/' + snapshot.key);
      item.remove();
    }).then(function() {
      var index = window.artistList.indexOf(window.artistName);
      if (index > -1) {
        window.artistList.splice(index, 1);
        $("#add_holder").removeClass("remove");
        $("#add_holder").addClass("add");
        $("#add_text").text("Add");
        $("#add").removeClass("fa-times");
        $("#add").addClass("fa-plus");
        $("#add_holder").addClass("flipInX");
      }

    });


  });

});