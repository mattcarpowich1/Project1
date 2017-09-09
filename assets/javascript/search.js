// Search artist using Last.fm API
$(function() {


  $("#search_form").on("submit", function(e) {

      e.preventDefault();

      var name = $("#search-input").val().trim();
      var api_key = "263e9002f2fe7d0f5701f46e4c576782";
      var queryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" +
        name + "&limit=1&api_key=" + api_key + "&format=json&autocorrect=1";

      $.ajax({ 
        url: queryURL, 
        method: "GET"
      }).done(function(response) { 
        if (response.error) {
          console.log("No results returned");
        } else {
          $("#info").hide();
          $("#facebook").empty();
          $("#instagram").empty();
          $("#twitter").empty();
          $("#tumblr").empty();

          var artist = response.artist;
          var artistName = artist.name;
          var artistBio = artist.bio.summary;
          var artistImageURL = artist.image[4]["#text"];
          console.log(artistImageURL);

          $("#searchResult").show();

          $("#artist_bio h3").text(artistName);
          $("#artist_image img").attr("src", artistImageURL);
          $("#artist_bio p").html(artistBio);

          $("#search-input").val("");

          $(".facebook").attr("href", "https://facebook.com/" + name.toUpperCase());
          $("#facebook").append("<span>FACEBOOK/" + name.toUpperCase() + "</span>");

          $(".instagram").attr("href", "https://instagram.com/" + name.toUpperCase());
          $("#instagram").append("<span>INSTAGRAM/" + name.toUpperCase() + "</span>");

          $(".twitter").attr("href", "https://twitter.com/" + name.toUpperCase());
          $("#twitter").append("<span>TWITTER/" + name.toUpperCase() + "</span>");

          $(".tumblr").attr("href", "https://tumblr.com/" + name.toUpperCase());
          $("#tumblr").append("<span>TUMBLR/" + name.toUpperCase() + "</span>");

        }
        
      });

      var queryURL2 = "https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + 
      name + "&api_key=" + api_key + "&limit=8&format=json";

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

          console.log(albums);

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


// my code begins here
       
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
                 $("#eventItems").append("<ul><li>Event Name: " + indEventName + "</li><li>Event Date & Time: " + indEventDateTime + "</li><li>Event Address: " + indEventAddress + "</li><li><a href='" + indEventTicketURL + "'>Click Here to Buy Your Ticket Now!</a></li></ul>");
               };
             };
            };
         });

      });

// my ajax call ends here


    }); 

});