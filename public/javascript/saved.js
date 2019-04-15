//Start of Document Ready function
$(document).ready(function() {

    //Parallax initialization
    $(".parallax").parallax();

    //Modal initialization
    $(".modal").modal();

    //Once document is loaded grab all the saved articles and display them in cards
    $.getJSON("/articles", function(data) {

      //Display the body's header if there is not any saved articles
      if (data.length !== 0) {
        $("#articles h4").hide();
      } else {
        $("#articles h4").show();
      }

      //Display only the articles that is saved
      for (var i = 0; i < data.length; i++) {
        if(data[i].isSaved === true) {

          var articleCard = "<div class='col s12 cardDiv'>" + 
                                "<div class='card horizontal'>" +
                                    "<div class='card-image'>" + 
                                        "<img class='articleImg' src=" + data[i].imgSrc + ">" +
                                    "</div>" + 
                                    "<div class='card-stacked'>" +
                                        "<div class='card-content'>" + 
                                        "<h6 class='articleTitle'>" + data[i].title + "</h6>" +
                                        "<a class='waves-effect waves-light btn right deleteArticle' data-id='" + data[i]._id + "'>Delete Article</a>" + 
                                        "<a class='waves-effect waves-light btn right takeAnote' data-id='" + data[i]._id + "'>Take a Note</a>" +
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

 //When user click on deleteArticle button, this article will be totally remmoved from the db ...
    $(document).on("click", ".deleteArticle", function () {
      var id = $(this).data("id");
      $.ajax({
          type: "DELETE",
          url: "/delete/" + id,
          }).then(function(res) {
              location.reload();
          });
      });

    //When user click of take a not button, a modal will diplayed for him to add his notes ..
    //If he already has entered some notes, these notes will be displayed in the modal screen
    $(document).on("click", ".takeAnote", function () {
      
      //That dammn step !!!!!!!!!
      $("#notesDiv").empty();

      //This is done to pass the article ID to the modal
      var id = $(this).data("id");
      $(".modal-footer").html(
        "<a href='#!' class='waves-effect waves-green btn-flat addNote' data-id = '" + id + "'>Add</a>" + 
        "<a href='#!' class='modal-close waves-effect waves-green btn-flat'>Close</a>"
        );
      $("#modal1").modal("open"); 

      $.ajax({
        method: "GET",
        url: "/note/" + id
      }).then(function(data) {
          console.log(data);

          if (data.note.length !== 0) {
            for (var i = 0 ; i < data.note.length ; i++) {
              $("#notesDiv").append(noteCard(data.note[i]));
            }
            
          }
        });

      });

      //When user click on addNote button, inside the modal, his entered note will be added and associated
      // to its specific article
      $(document).on("click", ".addNote", function() {
          var text = $("#note-text").val().trim();
          var id = $(this).data("id");
          $.ajax({
            method: "POST",
            url: "/addNote/" + id,
            data: {
              text: text
            }
          }).then(function(data) {
              console.log(data);
            });
        
          $("#note-text").val("");
        });

        //When user click on deleteNote, this specific note will be deleted
        $(document).on("click", ".deleteNote", function () {
          var id = $(this).data("id");
          $.ajax({
              type: "DELETE",
              url: "/deleteNote/" + id,
          }).then(function(res) {
              location.reload();
          });
        });


      function noteCard(data) {
          var noteCard = "<div class='col s12 m7'>" + 
                              "<div class='card horizontal'>" + 
                                    "<div class='card-stacked'>" +
                                        "<div class='card-content'>" + 
                                              "<p>" + data.text + "</p>" +
                                              "<a class='waves-effect waves-light btn right deleteNote' data-id='" + data._id + "'>Delete Note</a>" + 
                                        "</div>" + 
                                    "</div>" + 
                              "</div>" + 
                          "</div>";

                      return noteCard;
          }

}); //End of Document Ready Function