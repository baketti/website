const express = require('express');
const router = express.Router();
const Author = require('../models/author.js');
const Book = require('../models/book');

//tutte le rotte dell'autore => CONTROLLER AUTHOR
router.get('/', async (req,res)=>{
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name,'i')//i = case insensitive
    }
    try{
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {
            authors:authors,
            searchOptions:req.query
        })
    }catch{
        res.redirect('/',)
    }
})
// rotta nuovo autore
router.get('/new',(req,res)=>{
    res.render('authors/new', { author: new Author() })
})
//rotta per creare l'autore
router.post('/', async (req,res)=>{
    const author = new Author({
        name:req.body.name
    });
    console.log(author);
    try{
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`)
    }catch{
        res.render('authors/new',{
            author:author,
            errorMessage:'Error creating author'
        })
    }
})


router.get('/:id', async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
      const books = await Book.find({ author: author.id }).limit(6).exec()
      res.render('authors/show', {
        author: author,
        booksByAuthor: books
      })
    } catch {
      res.redirect('/')
    }
})
router.get('/:id/edit', async(req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    }catch{
        res.redirect('/authors')
    }
})
router.put('/:id',async (req,res)=>{
    let author;
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save();
        res.redirect(`/authors/${author.id}`)
    }catch{
        if(author == null){
            res.redirect('/')
        }else{
            res.render('authors/edit',{
                author:author,
                errorMessage:'Error updating author'
            })
        }
    }
})
/*
router.delete('/:id', async (req, res) => {
    let author;
    try {
      author = await Author.findById(req.params.id)
      console.log('author: ',author)
      console.log('dentro la DELETE')
      await author.remove()
      console.log('await author.remove(): ')
      res.redirect('/authors')
    } catch {
      if (author == null) {
        res.redirect('/')
      } else {
        console.log('dentro ELSE della DELETE')
        res.redirect(`/authors/${author.id}`)
      }
    }
})*/
router.delete('/:id', async (req, res) => {
    const books = await Book.find({ author: req.params.id }); 
    if (books.length > 0) {
        res.redirect(`/authors/${req.params.id}`);
        console.log(new Error('This author has books still'))
    } else {
        let author;
        try {
            author = await Author.findByIdAndRemove(req.params.id);
            res.redirect(`/authors`);
        } catch (err) {
            console.error(err); // Gestisci l'errore
            if (author == null) {
                res.redirect('/')
            } else {
                res.redirect(`/authors/${author.id}`)
            }
        }
    }  
})  

module.exports = router ;