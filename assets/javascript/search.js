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

          var artist = response.artist;
          var artistName = artist.name;
          var artistBio = artist.bio.summary;
          var artistImageURL = artist.image[3]["#text"];

          $("#bio").show();

          $("#bio-name").text(artistName);
          $("#bio-img").attr("src", artistImageURL);
          $("#bio-text p").html(artistBio);

          $("#search-input").val("");

        }
        
      });

    }); 

});