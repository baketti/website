const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const Book = require('../models/book');

const uploadPath = 'public/uploads/bookCovers'
//const uploadPath = path.join('public', Book.coverImageBasePath)
const Author = require('../models/author');


const imageMimeTypes = ['images/jpeg','images/png','images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req,file,callback)=>{
        callback(null,imageMimeTypes.includes(file.mimetype))
    }
});
//tutte le rotte dei books => CONTROLLER BOOK
router.get('/', async (req,res)=>{
    let query = Book.find();
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title,'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate',req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate',req.query.publishedAfter)
    }
    try{
        const books = await query.exec()
        res.render('books/index',{
            books: books,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
   
})
// rotta nuovo book
router.get('/new',async (req,res)=>{
    renderNewPage(res,new Book())
})
//rotta per creare book
router.post('/', upload.single('cover'),async (req,res)=>{
    console.log('siamo nel post /books')
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    try{
        console.log('nel try del post')
        const newBook = await book.save();
        //res.redirect(`books/${newbook.id}`)
        res.redirect('books')
        console.log('res.redirect("books") eseguito!')
    }catch{
        console.log('nel catch del post')
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res,book,true)
        console.log('renderNewPage(res,book,true) eseguito')
    }
})

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if(err) console.error(err);
    })
}
async function renderNewPage(res, book, hasError = false){
    try{
        console.log('try renderNewPage')
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        }
        console.log('if hasError nel try renderNewPage')
        if(hasError) params.errorMessage = 'Error Creating Book';
        console.log('dopo if hasError nel try renderNewPage')
        res.render('books/new', params)
        console.log('res.render(books/new) nel try renderNewPage ESEGUITO')
    }catch{
        console.log('catch renderNewPage')
        res.redirect('/books')
    }
}

module.exports = router ;