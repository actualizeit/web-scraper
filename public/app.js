var modalRefresh = false;
var currentID = ""

$(document).on('hidden.bs.modal','#note-modal', function () {
  console.log("modal closed")
  $(".modal-buttons").empty()
  $("#notes-target").empty()
  $("#noteTitle").val("")
  $("#noteBody").val("")
  if(modalRefresh){
    console.log("triggering")
    modalOpen();
    modalRefresh = false;
  }
});

$(document).on("click", "#saveNote", function() {
  console.log("#saveNote Clicked")
  modalRefresh = true
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
  .then(
    $('#note-modal').modal('hide')
  )
  $.ajax({
    url: "/articleNoted/" + id,
    method: "PUT"
  })
})

var modalOpen = function(id) {
  var thisId = id || currentID;
  console.log(thisId);
  $.ajax({
    method: "GET",
    url: "/notes/" + thisId
  }).then(function(data){
    console.log(data);
    //iterate all notes into modal
    for(let i=0; i < data.length; i++){
      $("#notes-target").append(
      "<div class='list-group-item'>" +
      "<button type='button' class='btn btn-danger float-right' id='deleteNote' data-id='" + data[i]._id + "' aria-label='delete note'>" +
      "<span aria-hidden='true'>&times;</span></button>" +
      "<h5 class='mb-1'>" + data[i].title + "</h5>" +
      "<p class='mb-1'>" + data[i].body + "</p>" +
      "</div>"
      )
    }
  })
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data){
    console.log(data);
    //insert article title into modal
  $("#articleNotes").text("Add and View Notes for the Article: ''" + data.title + "''");
  }).then($('#note-modal').modal('show'));
  $(".modal-buttons").append("<button type='button' class='btn btn-primary m-1 mb-3' id='saveNote' data-id='" + thisId + "'>Save Note</button>");
  $(".modal-buttons").append("<button type='button' class='btn btn-secondary m-1 mb-3' data-dismiss='modal'>Close</button>");
};

$(document).on("click", "#addNote", function() {
  var id = $(this).attr("data-id");
  currentID = id;
  modalOpen(id);
})

$(document).on("click", "#scrape-btn", function() {
  event.preventDefault();
  console.log("clicked-scrape")
  $.ajax({
    method: "GET",
    url: "/scrape"
    })
    .then(function(resp) {
      location.reload();
      console.log("andthen?")
    });
});

$(document).on("click", "#clearArticles-btn", function() {
  event.preventDefault();
  console.log("clicked-clearArticles")
  $.ajax({
    method: "PUT",
    url: "/clearArticles"
    })
    .then(function(resp) {
      location.reload();
    });
});

$(document).on("click", "#clearNotes-btn", function() {
  console.log("clicked-clearNotes")
  $.ajax({
    method: "PUT",
    url: "/clearNotes"
    })
  });

$("#scrape-btn").on("click", function() {
  console.log("scrape clicked")
  event.preventDefault();
  $.ajax({
      url: "/scrape",
      method: "GET"
  }).then(location.reload());
});


$(document).on("click", ".saveArticle", function() {
  event.preventDefault();
  var articleId = $(this).attr("data-id");
  $.ajax({
      url: "/articleSaved/" + articleId,
      method: "PUT",
  }).then(function(resp) {
      location.reload();
  });
});

$(document).on("click", "#deleteArticle", function() {
  var articleId = $(this).attr("data-id");
  console.log(articleId)
  $.ajax({
      url: "/deleteArticle/" + articleId,
      method: "PUT",
  }).then(function(resp) {
      location.reload();
  });
});

$(document).on("click", "#deleteNote", function() {
  var noteID = $(this).attr("data-id");
  console.log(noteID)
  $.ajax({
      url: "/deleteNote/" + noteID,
      method: "PUT",
  }).then(function(resp) {
    modalRefresh = true;
    $('#note-modal').modal('hide');
  });
});