const COVER_HOST = 'http://covers.openlibrary.org/b/id/'; // Add const variable for the book cover image host url

// Update bookObj to BookObj so that we can recognize it is book object function
function BookObj(book){
  let self = this
  self.cover_url = COVER_HOST + book.cover_i + '-M.jpg' // Replace url with const variable
  self.title = book.title || "" // if title is not given from the api, just set the title to blank

  // if author is not given from the api, just set the author to blank
  if (book.author_name) {
    self.author = book.author_name[0]
  } else {
    self.author = ""
  }
  self.html_link = 'https://openlibrary.org' + book.key

  self.htmlview = ""

  // Update the function into Promise so that we can handle next operation asynchronously
  self.updateHtml = function() {
    return new Promise((resolve, reject) => {
      fetch('templates/book-template.html')
        .then(response => response.text())
        .then(template => {
          self.htmlview = template.replace('{cover_url}', self.cover_url)
              .replace('{title}', self.title)
              .replace('{author}', self.author)
              .replace('{html_link}', self.html_link)

          resolve()
      })
    })
  }
}

// Update bookObj to BookObj so that we can recognize it is dom object function
function DomObj(){
  let self = this
  self.books = [];

  // Update getBooks function to Promise so that we can handle next operation asynchronously
  self.getBooks = async (url) => {
    return new Promise((resolve, reject) => {
      fetch(url).then(response => response.json()).then(data => {
        for(let i = 0; i < data.docs.length; i++) {
          self.books.push(
              new BookObj(data.docs[i])
          )
        }

        resolve();
      })
    })
  }

  // Update updateBookHtml function to Promise so that we can handle the next operation asynchronously
  self.updateBookHtml = () => {
    return new Promise((resolve, reject) => {

      // handle the updateHtml Promises with Promise.all to get all the book html update with better performance
      const bookHtmlPromise = []
      for(let i = 0; i < self.books.length; i++) {
        bookHtmlPromise.push(self.books[i].updateHtml())
      }

      Promise.all(bookHtmlPromise).then(() => resolve(self.books))
    })
  }

  // Rename updateDom to updateBookListDom so that the function name can have clear meaning
  self.updateBookListDom = (books) => {
    let thisHtml = ''
    for(let i = 0; i < books.length; i++){
      thisHtml += books[i].htmlview
    }
    document.getElementById('content').innerHTML = thisHtml
  }
}

let page = new DomObj()
// Remove setTimeout and handle updateBookHtml after getting all the book information from api
page.getBooks('http://openlibrary.org/search.json?title=the+lord+of+the+rings').then(async () => {
  // Remove setTimeout and wait for updateBookHtml is done before handle next action
  const books = await page.updateBookHtml()

  // Hide loading icon once the dom is ready to show
  document.getElementById("loading-icon").remove()

  // run updateDom function. actually this doesn't need to be run by await, but we might need to handle some actions next to it so used await
  await page.updateBookListDom(books)
})

// search by author or title and update dom
const searchBooks = () => {
  const searchKey = document.getElementById("search").value.trim().toLowerCase()
  const books = page.books.filter(book => book.author.toLowerCase().includes(searchKey) || book.title.toLowerCase().includes(searchKey))
  page.updateBookListDom(books)
}