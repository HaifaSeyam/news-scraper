//Start of Document Ready function
$(document).ready(function() {
  
    //Parallax initialization
    $(".parallax").parallax();

    $("#scrape").on("click", function() {
      
      $.ajax({
        type: "GET",
        url: "/scrape"
      }).then(function(data) {

        for (var i = 0 ; i < data.length ; i ++) {
          var articleCard = "<div class='col s12'><div class='card horizontal'>" +
                            "<div class='card-image'><img id='articleImg' src=" + data[i].imgSrc + "></div><div class='card-stacked'>" +
                            "<div class='card-content'><h6>" + data[i].title + "</h6><a class='waves-effect waves-light btn right'>Save Article</a></div><div class='card-action'>" +
                            "<a href=" + data[i].link + " target='_blank'>Read on JPost</a></div></div></div></div>";
                            $('#articles').append(articleCard);
            }
      });
  
    });

  }); //End of Document Ready Function