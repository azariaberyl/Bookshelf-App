/**
 * [
 *  {  
 *    id: number,  
 *    title: string,  
 *    author: string,  
 *    year: number,  
 *    isComplete: boolean  
 *  }
 * ]
 */
const KEY = 'BOOKS';
const RENDER = 'RENDER'
const books = [];
let tambahIsClose = true;
let filter = false;
const isStorageSupported = typeof(Storage) === undefined ? false : true;


document.addEventListener(RENDER, () => {
  const belumDibaca = document.getElementById('belum-dibaca');
  belumDibaca.innerHTML = '';
  
  const sudahDibaca = document.getElementById('selesai-dibaca');
  sudahDibaca.innerHTML = ' ';

  let filteredBooks;
  if (filter === true){
    filteredBooks = filterBooks();
    console.log(filteredBooks);
  } else {
    filteredBooks = books;
  }

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);
    if (book.isCompleted === true) {
      sudahDibaca.append(bookElement);
    } else {
      belumDibaca.append(bookElement);
    }
  }

})

document.addEventListener('DOMContentLoaded', () => {
  
  const tambahBtn = document.getElementById('tambah');
  const tambahForm = document.getElementById('tambah-form');
  const searchBtn = document.getElementById('search-form');
  
  const localBooks = JSON.parse(localStorage.getItem(KEY));
  if (localBooks !== null) {
    for (const book of localBooks) {
      books.push(book);
    }
    document.dispatchEvent(new Event(RENDER));
  }
  
  tambahBtn.addEventListener('click', () => {
    toggleTambahForm();
  });
  
  tambahForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
  });

  searchBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    filter = true;
    document.dispatchEvent(new Event(RENDER));
  })
  
});

function addBook() {
  const judul = document.getElementById('judul');
  const penulis = document.getElementById('penulis');
  const tahun = document.getElementById('tahun');

  const book = {
    id: +new Date(),
    title: judul.value,
    author: penulis.value,
    year: tahun.value,
    isCompleted: false
  }

  books.push(book);
  document.dispatchEvent(new Event(RENDER));
  localStorage.setItem(KEY,JSON.stringify(books));
  judul.value = '';
  penulis.value = '';
  tahun.value = '';
}

function toggleTambahForm() {
  const tambahForm = document.getElementById('tambah-form-container');
  tambahIsClose ? tambahForm.classList.remove('hidden') : tambahForm.classList.add('hidden');
  tambahIsClose = !tambahIsClose;
}

function createBookElement(book) {
  const container = document.createElement('div');
  container.classList.add('book', 'shadow');

  const detail = document.createElement('div');
  detail.classList.add('detail');
  container.append(detail);

  const h3 = document.createElement('h3');
  h3.innerText = book.title;
  detail.append(h3);

  const penulis = document.createElement('p');
  penulis.innerText = 'Penulis: '+book.author;
  detail.append(penulis)

  const tahun = document.createElement('p');
  tahun.innerText = 'Tahun: '+book.year;
  detail.append(tahun)

  const buttons = document.createElement('div');
  buttons.classList.add('buttons');
  container.append(buttons);

  if (book.isCompleted) {
    const undone = document.createElement('button');
    undone.innerText = 'Belum selesai';
    undone.classList.add('button1');
    undone.addEventListener('click', () => undoneIsCompleted(book.id));
    buttons.append(undone);

    const hapus = document.createElement('button');
    hapus.innerText = 'Hapus';
    hapus.classList.add('button1');
    hapus.addEventListener('click', () => hapusBook(book.id));
    buttons.append(hapus);
  } else if (!book.isCompleted){
    const done = document.createElement('button');
    done.innerText = 'Selesai Dibaca';
    done.classList.add('button1');
    done.addEventListener('click', () => doneIsCompleted(book.id));
    buttons.append(done);

    const hapus = document.createElement('button');
    hapus.innerText = 'Hapus';
    hapus.classList.add('button1');
    hapus.addEventListener('click', () => hapusBook(book.id));
    buttons.append(hapus);
  }

  return container;
}

function undoneIsCompleted(id) {
  const index = findBooksIndex(id);
  books[index].isCompleted = false;
  
  localStorage.setItem(KEY, JSON.stringify(books));
  document.dispatchEvent(new Event(RENDER));

}

function hapusBook(id) {
  const index = findBooksIndex(id);
  books.splice(index, 1);
  
  localStorage.setItem(KEY, JSON.stringify(books));
  document.dispatchEvent(new Event(RENDER));
}

function doneIsCompleted(id) {
  const index = findBooksIndex(id);
  books[index].isCompleted = true;
  
  localStorage.setItem(KEY, JSON.stringify(books));
  document.dispatchEvent(new Event(RENDER));

}

function findBooksIndex(id) {
  for (const key in books) {
    if (books[key].id == id){
      return key
    }
  }
}

function filterBooks(){
  const searchValue= document.getElementById('search').value.toLowerCase();

  return books.filter((book) => {
    return book.title.toLowerCase().indexOf(searchValue) !== -1 ? true : false;
  })
}