$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.btn-delete', deleteBook);
  $('#bookShelf').on('click', '.btn-read', readBook);
  $('#bookShelf').on('click', '.btn-read', function(event){
    let bookId = $(this).closest('tr').data('id');
    //readBook('read', bookId)
  });
  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}



// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $(`<tr></tr>`);
    $tr.data('id', book.id);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);
    $tr.append(`<td><button class="btn-delete">DELETE</button></td>`);
    $tr.append(`<td><button class="btn-read">MARK AS READ</button></td>`);
    $('#bookShelf').append($tr);
  }
}
function deleteBook(){
  console.log('delete clicked');
  console.log( $(this).closest('tr').data('id') );
  let bookId = $(this).closest('tr').data('id');
    $.ajax({
      method: 'DELETE',
      url:`/books/${bookId}`
    })
    .then( function(response) {
      refreshBooks();
    })
    .catch( function(error){
      console.log('error in delete', error);
      alert('something went wrong try again later')
    })
  
}
function readBook(){
  console.log('read clicked');
  //console.log( $(this).closest('tr').data('id') );
  let id = $(this).closest('tr').data('id');
  console.log(`changing status ${status}... for book ${id}...` );
    
    $.ajax({
        method: 'PUT',
        url: `/books/${id}`,
        //data: {status: status}
        
    })
    .then( function(response) {
        refreshBooks();
    })
    .catch( function(error){
        console.log('error in mark as read', error);
        alert('something bad happened. try again later')
    })

}