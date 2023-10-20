const express = require('express');
const router = express.Router();
const Author = require('../models/author.js');
//tutte le rotte dell'autore => CONTROLLER AUTHOR
router.get('/', async (req,res)=>{
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name,'i')//i = case insensitive
    }
    try{
        const authors = await Author.find(searchOptions)
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
    console.log("prima dell author.save")
    console.log(author);
    try{
        const newAuthor = await author.save();
        //res.redirect(`authors/${newAuthor.id}`)
        res.redirect(`authors`)
    }catch{
        res.render('authors/new',{
            author:author,
            errorMessage:'Error creating author'
        })
    }
})

module.exports = router ;