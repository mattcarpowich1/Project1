$(function() {


  function showErrorMessage(text) {
    $("#searchResult").hide();
    var $message = $("<h2>");
    $message.text(text);
    $("#no_results_message").append($message);
    $("#info").hide();
    $("#no_results").show();
  }

  function search(name) {
    var api_key = "263e9002f2fe7d0f5701f46e4c576782";
    var queryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" +
      name + "&limit=1&api_key=" + api_key + "&format=json&autocorrect=1";

    $("#my_artists").hide();

    // Search artist using Last.fm API
    $.ajax({ 
      url: queryURL, 
      method: "GET"
    }).done(function(response) { 
      if (response.error) {
        $("#no_results_message").empty();
        showErrorMessage("No results found for " + name);
      } else {
        $("#info").hide();
        $("#facebook").empty();
        $("#instagram").empty();
        $("#twitter").empty();
        $("#tumblr").empty();
        $("#no_results_message").empty();
        $("#no_results").hide();

        var artist = response.artist;
        var artistName = artist.name;
        var artistBio = artist.bio.summary;
        var artistImageURL = artist.image[4]["#text"];

        // error cases
        if (artistName === "[unknown]") {
          showErrorMessage("No results found for " + name);
          return false;
        }

        window.artistName = artistName;
        window.imgURL = artistImageURL;

        console.log("ARTIST LIST: " + window.artistList);
        console.log("ARTIST NAME: " + window.artistName);

        // if this artist is in the artist list
        if (window.artistList.indexOf(window.artistName) > -1) {
          $("#add_holder").removeClass("add");
          $("#add_holder").addClass("remove");
          $("#add_text").text("Remove");
          $("#add").removeClass("fa-plus");
          $("#add").addClass("fa-times");
        } else {
          $("#add_holder").removeClass("remove");
          $("#add_holder").addClass("add");
          $("#add_text").text("Add");
          $("#add").removeClass("fa-times");
          $("#add").addClass("fa-plus");
        }

        $("#searchResult").show();

        $("#artist_bio h3").text(artistName);
        $("#artist_image img").attr("src", artistImageURL);
        $("#artist_bio p").html(artistBio);

        $("#search-input").val("");

        //ajax call for albums

        var queryURL2 = "https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + 
        name + "&api_key=" + api_key + "&limit=10&format=json";

        $.ajax({
          url: queryURL2,
          method: "GET"
        }).done(function(response) {
          if (response.error) {
            console.log("No results returned");
          } else {

            $("#artist_albums").empty();
            //array of albums
            var albums = response.topalbums.album;

            for (var i = 0; i < albums.length; i++) {

              if (albums[i].image[2]["#text"] === "") {
                continue;
              }

              var $imgHolder = $("<div>");
              $imgHolder.addClass("img-holder");

              var $albumImg = $("<img>");
              $albumImg.addClass("album-img");
              $albumImg.attr("src", albums[i].image[2]["#text"]);

              var $albumTitle = $("<small>");
              $albumTitle.addClass("album-title");
              $albumTitle.text(albums[i].name);

              $imgHolder.append($albumImg).append($albumTitle);

              $("#artist_albums").append($imgHolder);
            } 

          }

        });

        // ajax call for songs
        var queryURL3 = "https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" +
        name + "&limit=10&api_key=" + api_key + "&format=json&autocorrect=1";

        $.ajax({ 
          url: queryURL3, 
          method: "GET"
        }).done(function(response) { 
            if (response.error) {
              console.log("No results returned");
            } else {
              
              $("#songs-list").empty();

              var songs = response.toptracks.track;

              for (var i=0; i < songs.length; i++) {

                var $songTitle = $("<a href=" + songs[i].url + "><h6>").addClass("song");

                var $listItem = $("<li>").append($songTitle);

                $songTitle.text(songs[i].name);
                $("#songs-list").append($listItem);

              }
          }
          
        });

        var artist_id;
        // var api_key2 = "c8303e90962e3a5ebd5a1f260a69b138";
        var api_key3 = "21cbdbd61de260cbec654f0bd5be5c81";
        var queryURL4 = "http://api.musicgraph.com/api/v2/artist/search?api_key=" + api_key3 + "&name=" + name;
        
        // one api call nested inside another, first one gets artsit_id, second one - gets artist_urls
        $.ajax({ 
          url: queryURL4, 
          method: "GET"
        }).done(function(response) {
            if (response.error) {
            console.log("No results returned");
            } else {
              var artist_id = String(response.data[0].id);
              console.log(artist_id);
              var queryURL5 = "http://api.musicgraph.com/api/v2/artist/" + artist_id + "/social-urls?api_key=" + api_key3;

              $.ajax({
                url: queryURL5,
                method: "GET"
              }).done(function(response) {
                var facebookURL = response.data.facebook_url;
                var twitterURL = response.data.twitter_url;
                var instagramURL = response.data.instagram_url;

                if (facebookURL) {
                  $(".facebook").attr("href", facebookURL);
                  $(".facebook .url-holder span").text(facebookURL);
                  $(".facebook").show();
                } else {
                  $(".facebook").hide();
                }

                if (twitterURL) {
                  $(".twitter").attr("href", twitterURL);
                  $(".twitter .url-holder span").text(twitterURL);
                  $(".twitter").show();
                } else {
                  $(".twitter").hide();
                }

                if (instagramURL) {
                  $(".instagram").attr("href", instagramURL);
                  $(".instagram .url-holder span").text(instagramURL);
                  $(".instagram").show();
                } else {
                  $(".instagram").hide();
                }

                if (response.data.official_url) {
                  console.log("HEY");
                  $(".official").attr("href", response.data.official_url[0]);
                  $("#official").text(response.data.official_url[0]);
                  $(".official").show();
                } else {
                  $(".official").hide();
                }

              });
            }
          });

        // ajax call for events information
        var eventsAPI = "zvvfvcjv5yh3mdw32ypf9dqn";
        var replacedName = name.split(' ').join('-');
        var artistId = '';
        console.log("name: " + replacedName);
        // Ajax call to get Artist ID
        var eventsUrlByArtist = "http://api.jambase.com/artists?name=" + name + "&page=0&api_key=" + eventsAPI;
        $.ajax({
         url: eventsUrlByArtist,
         method: "GET"
        }).done(function(response) {
          artistId = response.Artists[0].Id;

          // Ajax call to get events:
          var eventsURL = "http://api.jambase.com/events?artistId=" + artistId + "&api_key=" + eventsAPI;
          console.log(eventsURL);
          $.ajax({
            url: eventsURL,
            method: "GET"
          }).done(function(response) {
            if (response.error) {
               $("#eventItems").html("No Event information");
               console.log("No upcoming events to show");
            } else {
              $("#eventItems").empty();
              console.log(response);
              var allEvents = response.Events;
              console.log("all events" + allEvents);
              var numEvents = allEvents.length;

              if (allEvents.length == 0) {
                $("#eventItems").html("No Upcoming Events to Show");
              } else {
                var indEventName = '';
                var indEventDateTime = '';
                var indEventAddress = '';
                var indEventTicketURL = '';

                for (index = 0; index < numEvents; index++) {
                  indEventName = response.Events[index].Venue.Name;
                  indEventDateTime = response.Events[index].Date;
                  indEventAddress = response.Events[index].Venue.Address;
                  indEventTicketURL = response.Events[index].TicketUrl;
                  console.log("name" + indEventName);
                  console.log("date " + indEventDateTime);
                  console.log("address" + indEventAddress);
                  console.log("URL" + indEventTicketURL);

                  // $("#eventItems").append("<ul><li>Event Name: " + indEventName + "</li><li>Event Date & Time: " + indEventDateTime + "</li><li>Event Address: " + indEventAddress + "</li><li><a href='" + indEventTicketURL + "'>Click Here to Buy Your Ticket Now!</a></li></ul>");

                  var $event = $("<div>");
                  $event.addClass("event");

                  //if there is date info, format and append to $event
                  if (indEventDateTime) {
                    var timeArray = indEventDateTime.split("T");
                    var date = timeArray[0];
                    var date = moment(date).format("MMMM Do YYYY");
                    $event.append("<p><span class='event-date'>" + date + "</span></p>");
                  } 

                  //if there is an event name, append to $event
                  if (indEventName) {
                    $event.append("<p><span class='event-name'>" + indEventName + "</span></p>");
                  } 

                  //if there is an event address, append to $event
                  if (indEventAddress) {
                    $event.append("<p><span class='event-address'>" + indEventAddress + "</span></p>");
                  } 

                  //if there is a url for tickets, create link and append to $event
                  if (indEventTicketURL) {
                    $event.append("<p><a class='ticket-link' href='" + indEventTicketURL + "'>TICKETS</a></p>");
                  }

                  $("#eventItems").append($event);

                };
              };
            };
          });

        });

      }
      
    });
  }


  $("#search_form").on("submit", function(e) {

      e.preventDefault();

      var name = $("#search-input").val().trim();
      search(name);

  }); 

  $("body").on("click", ".artist-holder", function(e) {

    var name = $(this).children().eq(1).text();
    search(name);

  });

});