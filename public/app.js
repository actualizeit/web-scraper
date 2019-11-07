
$.getJSON("/articles", function(data) {
  currentArticles = data
});

$(document).on('show.bs.modal','#note-modal', function (e) {
  console.log("modal open")
  var articleID = e.relatedTarget.dataset.id;
  $(".modal-footer").append("<button type='button' class='btn btn-primary' id='saveNote' data-id='" + articleID + "'>Save Note</button>");
  $(".modal-footer").append("<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>");
});

$(document).on('hidden.bs.modal','#note-modal', function () {
  console.log("modal closed")
  $(".modal-footer").empty()
  $("#noteTitle").empty()
  $("#noteBody").empty()
});

$(document).on("click", "#saveNote", function() {
  console.log("#saveNote Clicked")
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
  }).then($('#note-modal').modal('hide'))
})

$(document).on("click", "#addNote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/notes/" + thisId
  }).then(
    $('#note-modal').modal('show')
  )
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  });
});

$(document).on("click", "#scrape-btn", function() {
  console.log("clicked-scrape")
  $.ajax({
    method: "GET",
    url: "/scrape"
    })
  });

$(document).on("click", "#clearArticles-btn", function() {
  console.log("clicked-clearArticles")
  $.ajax({
    method: "PUT",
    url: "/clearArticles"
    })
  });

$(document).on("click", "#clearNotes-btn", function() {
  console.log("clicked-clearNotes")
  $.ajax({
    method: "PUT",
    url: "/clearNotes"
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
  }).then(location.reload());
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