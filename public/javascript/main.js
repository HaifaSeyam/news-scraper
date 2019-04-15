//Start of Document Ready function
$(document).ready(function() {

    //Parallax initialization
    $(".parallax").parallax();

    //Once document loaded grab all the articles in the db
    $.getJSON("/articles", function(data) {

      //If there is data hide the header and display the article cards
      if (data.length !== 0) {
        $("#articles h4").hide();
      } else {
        $("#articles h4").show();
      }
      for (var i = 0; i < data.length; i++) {
        //Display only the articles that is not saved
        if(data[i].isSaved === false) {
          var articleCard = "<div class='col s12 cardDiv'>" + 
                                "<div class='card horizontal'>" +
                                    "<div class='card-image'>" + 
                                        "<img class='articleImg' src=" + data[i].imgSrc + ">" +
                                    "</div>" + 
                                    "<div class='card-stacked'>" +
                                        "<div class='card-content'>" + 
                                        "<h6 class='articleTitle'>" + data[i].title + "</h6>" +
                                        "<a class='waves-effect waves-light btn right saveArticle' data-id='" + data[i]._id + "'>Save Article</a>" + 
                                    "</div>" + 
                                    "<div class='card-action'>" +
                                        "<a class='articleLink' href=" + data[i].link + " target='_blank'>Read on NYT</a>" +
                                    "</div>" + 
                                "</div>" + 
                              "</div>";    
          $('#articles').append(articleCard); 
        } 
      }
    });

    //Reload the page once the user click on the scrape button in the body's header or in the nav bar
    $(document).on("click", ".scrape", function () {
      $(document).ready();
    });
    
    //Once the user click on saveArticle button, save that article
    $("#articles").on("click", ".saveArticle", function () {

        $(this).text("Article Saved");
        $(this).attr({ disabled: "" });

        var id = $(this).data("id");

          var savedArticle = {}
          savedArticle.imgSrc = $(this).parent(".card-content").parent(".card-stacked").siblings(".card-image")
          .children(".articleImg").attr("src");
          savedArticle.title = $(this).parent(".card-content").children(".articleTitle").text();
          savedArticle.link = $(this).parent(".card-content").siblings(".card-action").children(".articleLink").attr("href");
          console.log(savedArticle);
          $.ajax({
            type: "PUT",
            url: "/saved/" + id,
            data: savedArticle
          }).then(function(res) {
            //Do nothing
          })
    });


}); //End of Document Ready Function















// $(document).on("click", ".deletNote", function () {
// var id = $(this).data("id");
// $.ajax({
//   type: "DELETE",
//   url: "/deleteNote/" + id,
// }).then(function(res) {
//   location.reload();
// });
// });


