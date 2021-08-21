function bookObj(book){
  let self = this
  self.cover_url = 'http://covers.openlibrary.org/b/id/' + book.cover_i + '-M.jpg'
  self.title = book.title
  if (book.author_name) self.author = book.author_name[0]
  self.html_link = 'https://openlibrary.org' + book.key
  self.htmlview = ""

  self.updateHtml = function(){
    fetch('book-template.html').then(response => response.text()).then(template => {
      self.htmlview = template.replace('{cover_url}', self.cover_url)
        .replace('{title}', self.title)
        .replace('{author}', self.author)
        .replace('{html_link}', self.html_link)
      }
    )
  }
}

function domObj(){
  let self = this
  self.books = [];

  self.getBooks = function(url){
    fetch(url).then(response => response.json()).then(data => {
      for(let i = 0; i < data.docs.length; i++) {
        self.books.push(
          new bookObj(data.docs[i])
        )
      }
    })
  }

  self.updateBookHtml = function(){
    for(let i = 0; i < self.books.length; i++) {
      self.books[i].updateHtml()
    }
  }

  self.updateDom = function(){
    let thisHtml = ''
    for(let i = 0; i < self.books.length; i++){
      thisHtml += self.books[i].htmlview
    }
    document.getElementById('content').innerHTML += thisHtml
  }
}

let page = new domObj()
page.getBooks('http://openlibrary.org/search.json?title=the+lord+of+the+rings')
setTimeout(() => { page.updateBookHtml() }, 1000)
setTimeout(() => { page.updateDom() },2000)