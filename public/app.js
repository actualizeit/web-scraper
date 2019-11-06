// const $noteBtn = $('#notez');
// $noteBtn.on('click');

// $(document).on("click", "#notez", function() {
//   console.log("that tickled")
// });

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  currentArticles = data
});

$(document).on('show.bs.modal','#note-modal', function (e) {
  console.log("modal open")
  var articleID = e.relatedTarget.dataset.id;
  $(".modal-footer").append("<button type='button' class='btn btn-primary' id='saveNote' data-id='" + articleID + "'>Save Note</button>");
  $(".modal-footer").append("<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>");
  $.ajax({
    method: "GET",
    url: "/notes/" + articleID
  })
  console.log("weird")
});

$(document).on('hidden.bs.modal','#note-modal', function () {
  console.log("modal closed")
  $(".modal-footer").empty()
});




$(document).on("click", "#saveNote", function() {
  console.log("yeahboi")
  // $(".modal-footer").append("<button type='button' class='btn btn-primary' id='saveNote' data-id='" + $(this).attr("data-id") + "'>Save Note</button>");
  // $(".modal-footer").append("<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>");
  var id = $(this).attr("data-id");
  var noteTitle = $('#noteTitle').val().trim()
  var noteBody = $('#noteBody').val().trim()
  console.log("title: " + noteTitle + " - body: " + noteBody);
  $.ajax({
    url: "/notes/" + id,
    method: "POST",
    data: {
      noteTitle,
      noteBody
    }
})
})


// $("body").on("click", ".add-btn", function() {
//   event.preventDefault();
//   var id = $(this).attr("data-articleId");
//   var titleId = $(this).attr("data-title");
//   var bodyId = $(this).attr("data-body");

//   var title = $(titleId).val().trim();
//   var body = $(bodyId).val().trim();

//   console.log("id:" + id);
//   console.log("titleId" + titleId);
//   console.log("bodyId" + bodyId);
//   console.log("title" + title);
//   console.log("body" + body);

//   $.ajax({
//       url: "/articles/notes/" + id,
//       method: "POST",
//       data: {
//           title,
//           body
//       }
//   }).then(function(edited) {
//       console.log(edited);
//       location.reload();
//   });
// });



// Whenever someone clicks a p tag
$(document).on("click", "#notez", function() {
  console.log("that tickled")
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});


$(document).on("click", "#scrape-btn", function() {
  console.log("clicked-scrape")
  $.ajax({
    method: "GET",
    url: "/scrape"
    })
  });

  $(document).on("click", "#clear-btn", function() {
    console.log("clicked-clear")
    $.ajax({
      method: "PUT",
      url: "/clear"
      })
    });

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$("#scrape-btn").on("click", function() {
  console.log("scrape clicked")
  event.preventDefault();
  $.ajax({
      url: "/scrape",
      method: "GET"
  }).then(function() {
      setTimeout(function() {
          location.reload();
      }, 500);
  });
});

$(document).on("click", ".savebtn", function() {
  event.preventDefault();
  console.log("yup")
  var articleId = $(this).attr("data-id");
  var queryUrl = "/article/" + articleId;
  $.ajax({
      url: queryUrl,
      method: "PUT",
      data: {
          saved: true
      }
  }).then(function(response) {
      location.reload();
  });


});