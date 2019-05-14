﻿$(document).ready(function () {
    listAllBooks();
    getUser();
    var book = {};
    var url = "";
    var method = "";
    $('#btnAddBook').click(function () {
        book.bookId = $('#bookId').val();
        book.bookName = $('#bookName').val();
        book.authorName = $('#authorName').val();
        book.genreName = $('#genreName').val();
        var bookObj = JSON.stringify(book);
        if (validateForm()) {
            if (book.bookId) {
                url = "/api/v1/books/" + book.bookId;
                method = 'PUT';
            } else {
                url = "/api/v1/books";
                method = 'POST'
            }
            $.ajax({
                url: url,
                method: method,
                data: bookObj,
                contentType: 'application/json; charset=utf-8',
                success: function () {
                    listAllBooks();
                    reset();
                },
                error: function (xhr, error) {
                    if (xhr.status == 403) {
                        reset();
                        alert("У вас недостаточно прав!")
                    } else {
                        alert(error)
                    }
                    ;
                }
            })
        }
        return;
    });
});

function validateForm() {
    var b = $('#bookName').val();
    var c = $('#authorName').val();
    var d = $('#genreName').val();

    if (b == null || b == "") {
        alert("Имя книги не заполнено!");
        return false;
    }
    if (c == null || c == "") {
        alert("Укажите автора!");
        return false;
    }
    if (d == null || d == "") {
        alert("Укажите жанр!");
        return false;
    }
    return true;
}


function listAllBooks() {
    $.get('/api/v1/books').done(function (books) {
        $('#booksTableBody').empty();
        books.forEach(function (book) {
            // noinspection JSAnnotator
            $('#booksTableBody').append(`
                    <tr>
                        <td>${book.bookId}</td>
                        <td>${book.bookName}</td>
                        <td>${book.author.authorName}</td>
                        <td>${book.genre.genreName}</td>
                        <td><button onclick="updateBook(${book.bookId})">Изменить</button></td>
                        <td><button onclick="deleteBook(${book.bookId})">Удалить</button></td>
                    </tr>
                `)
        });
    })
}

function deleteBook(bookId) {
    $.ajax({
        url: '/api/v1/books/' + bookId,
        method: 'DELETE',
        success: function () {
            listAllBooks();
        },
        error: function (xhr, error) {
            if (xhr.status == 403) {
                alert("У вас недостаточно прав!")
            } else {
                alert(error)
            }
            ;
        }
    })
}

function updateBook(bookId) {
    $.ajax({
        url: '/api/v1/books/' + bookId,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#bookId').val(data.bookId);
            $('#bookName').val(data.bookName);
            $('#authorName').val(data.author.authorName);
            $('#genreName').val(data.genre.genreName);
            document.getElementById("authorName").disabled = true;
            document.getElementById("genreName").disabled = true;
        },
        error: function (xhr, error) {
            if (xhr.status == 403) {
                reset();
                alert("У вас недостаточно прав!")

            } else {
                alert(error)
            }
            ;
        }
    })
}


function getUser() {
    $.ajax({
        url: '/username',
        method: 'GET',
        data: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            // noinspection JSAnnotator
            $('#user').append(`<span>${data}</span>`);
        },
        error: function (error) {
            alert(error);
        }
    })
}

function reset() {
    $('#bookId').val('');
    $('#bookName').val('');
    $('#authorName').val('');
    $('#genreName').val('');
    document.getElementById("authorName").disabled = false;
    document.getElementById("genreName").disabled = false;
}
