// Grab the articles as a json
$.getJSON("/products", function(data) {
  // For each one
  console.log(data[0]);

  for (var i = 0; i < data.length; i++) {
    //once you have note information
    // Display the all the notes under each object on the page
    $("#products").append("<div id='"+data[i]._id+"'><p data-id='" + data[i]._id + "'>" + data[i].category +' || '+ data[i].price  + "</p><a href='" + data[i].link + "'>Product Link</a><br/><img src='"+data[i].imglink+"' width='200' height='200'></br><button data-id='" + data[i]._id + "' class='addnote'>Add Note</button><div id='note"+ data[i]._id+"'></div></div><hr>");
    
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "button[class='addnote']", function() {
  // Empty the notes from the note section 
  
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  
  //$("div#note"+thisId).empty();
  $("div#note"+thisId).append("<input id='titleinput"+thisId+"' name='title' >");
  $("div#note"+thisId).append("<textarea id='bodyinput"+thisId+"' name='body'></textarea>");
  $("div#note"+thisId).append("<button data-id='" + thisId + "' class='savenote'>Save Note</button>");
  // $.ajax({
  //   method: "GET",
  //   url: "/products/" + thisId
  // })
  //   // With that done, add the note information to the page
  //   .then(function(data) {
  //     if (data.note) {
  //       // Place the title of the note in the title input
  //       $("#titleinput"+data._id).val(data.note.title);
  //       // Place the body of the note in the body textarea
  //       $("#bodyinput"+data._id).val(data.note.body);
  //     }
  //   });
});

// When you click the savenote button
$(document).on("click", "button[class='savenote']", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  console.log($("#titleinput"+thisId).val());
  console.log($("#bodyinput"+thisId).val());
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/products/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput"+thisId).val(),
      // Value taken from note textarea
      body: $("#bodyinput"+thisId).val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      
    });
  $("div#note"+thisId).empty();
  // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput"+thisId).val("");
  // $("#bodyinput"+thisId).val("");
});
