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
    var id = $(this).data("id");
    $("#modal1").modal("open"); 
  });

}); //End of Document Ready Function




  // $.ajax({
  //   type: "GET",
  //   url: "/allNotes/" + id
  //   }).then(function(results) {
  //     if (results.length !== 0) {
  //       $("#notesDiv").append(noteCard(results));
  //     }
      
  //   });


  //   $(document).on("click", ".addNoteBtn", function(){

  //     var noteText = $("#note-text").val().trim();
  //     var id = $(this).data("id");
      
  //       $.ajax({
  //         type: "POST",
  //         url: "/notes",
  //         data: {
  //             text: noteText,
  //             id: id
  //         }
  //     }).then(function(results) {
  //       //do nothing
  //     })
    
  //   });



  // function noteCard(results) {
  //   var noteCard = "<div class='col s12 m7'><div class='card horizontal'><div class='card-stacked'>" + 
  //                  "<div class='card-content'><p>" + results.text + "</p>" +
  //                  "<a class='waves-effect waves-light btn right'>Delete Note</a></div></div></div></div>";
  
  //                  return noteCard;
  // }
  