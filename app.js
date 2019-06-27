// Book Class to represent a book
class Book {
  constructor(title, author, rating) {
    this.title = title;
    this.author = author;
    this.rating = rating;
  }
}

// UI Class Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    // add book to list
    books.forEach(book => UI.addBookToList(book));
  }

  // create row to inesrt into table
  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><span>&nbsp&nbsp</span>${
          book.rating
        }&nbsp<i class="fas fa-star"></i></td>
        <td><a href="#" class="btn btn-danger btn-sm delete font-weight-bold">X</a></td>
        `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    // insert div
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // Timeout
    setTimeout(() => document.querySelector(".alert").remove(), 2500);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#rating").value = "";
  }
}

// Store Class Handle storage locally
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(title) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.title === title) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event add a book
document.querySelector("#book-form").addEventListener("submit", e => {
  // Prevent actual submission
  e.preventDefault();
  // Get Form Values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const rating = document.querySelector("#rating").value;

  //   Validate
  if (title === "" || author === "" || rating === "") {
    UI.showAlert("Please fill in all fields.", "danger");
  } else {
    // Instantiate Book
    const book = new Book(title, author, rating);

    // Show Success Alert
    UI.showAlert("New Book Added", "success");

    // Add Book to UI
    UI.addBookToList(book);

    // Add Book to local storage
    Store.addBook(book);

    // Clear Fields
    UI.clearFields();
  }
});

// Event remove a book
document.querySelector("#book-list").addEventListener("click", e => {
  // Remove book from UI
  UI.deleteBook(e.target);
  // Remove book from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
  UI.showAlert("Book Removed", "success");
});
