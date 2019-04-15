//Start of Document Ready function
$(document).ready(function() {
  
    //Parallax initialization
    $(".parallax").parallax();
    
    //Modal initialization
    $(".modal").modal();

    $("#scrape").on("click", function() {

      $.ajax({
        type: "GET",
        url: "/scrape"
      }).then(function(data) {

        for (var i = 0 ; i < data.length ; i ++) {
          var articleCard = "<div class='col s12'><div class='card horizontal'>" +
                            "<div class='card-image'><img class='articleImg' src=" + data[i].imgSrc + "></div><div class='card-stacked'>" +
                            "<div class='card-content'><h6 class='articleTitle'>" + data[i].title + "</h6>" + 
                            "<a class='waves-effect waves-light btn right saveArticle'>Save A rticle</a></div><div class='card-action'>" +
                            "<a class='articleLink' href=" + data[i].link + " target='_blank'>Read on NYT</a></div></div></div></div>";
                            $('#articles').append(articleCard);             
            }
      });
  
    });

    $("#articles").on("click", ".saveArticle", function () {

			$(this).text("Article Saved");
      $(this).attr({ disabled: "" });

        var savedArticle = {}
        savedArticle.imgSrc = $(this).parent(".card-content").parent(".card-stacked").siblings(".card-image")
        .children(".articleImg").attr("src");
        savedArticle.title = $(this).parent(".card-content").children(".articleTitle").text();
        savedArticle.link = $(this).parent(".card-content").siblings(".card-action").children(".articleLink").attr("href");

        console.log(savedArticle);
        $.ajax({
          type: 'POST',
          url: '/saved',
          data: savedArticle
        }).then(function(res) {
          //Do nothing
        })
    });

    $(document).on("click", ".deleteArticle", function () {
      var id = $(this).data("id");
      $.ajax({
          type: "DELETE",
          url: "/delete/" + id,
      }).then(function(res) {
          location.reload();
      });
  });

  $(document).on("click", ".addNote", function () {
    
    $("#modal1").modal("open"); 

    var id = $(this).data("id");

    $.ajax({
      method: "GET",
      url: "/displayNotes/" + id
    }).then(function(data) {
        console.log(data);
        // If there's a note in the article
        if (data.note.length !== 0) {
          for (var i = 0 ; i < data.note.length ; i++) {
            $("#notesDiv").append(noteCard(data.note[i]));
          }
          
        }
      });


      $(document).on("click", ".addNoteBtn", function() {
        var text = $("#note-text").val().trim();
      
        $.ajax({
          method: "POST",
          url: "/addNotes/" + id,
          data: {
            text: text,
            articleId: id
          }
        }).then(function(data) {
            console.log(data);
          });
      
        // Also, remove the values entered in the input and textarea for note entry
        $("#note-text").val("");
      });


  });

$(document).on("click", ".deletNote", function () {
  var id = $(this).data("id");
  $.ajax({
      type: "DELETE",
      url: "/deleteNote/" + id,
  }).then(function(res) {
      location.reload();
  });
});


function noteCard(data) {
  var noteCard = "<div class='col s12 m7'><div class='card horizontal'><div class='card-stacked'>" + 
                 "<div class='card-content'><p>" + data.text + "</p>" +
                 "<a class='waves-effect waves-light btn right deletNote' data-id='" + data._id + "'>Delete Note</a></div></div></div></div>";

                 return noteCard;
}

}); //End of Document Ready Function