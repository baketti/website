const express = require('express');
const router = express.Router();
const Author = require('../models/author.js');
//tutte le rotte dell'autore => CONTROLLER AUTHOR
router.get('/',(req,res)=>{
    res.render('authors/index')
})
// rotta nuovo autore
router.get('/new',(req,res)=>{
    res.render('authors/new', { author: new Author() })
})
//rotta per creare l'autore
router.post('/',(req,res)=>{
    const author = new Author({
        name:req.body.name
    });
    console.log("prima dell author.save")
    console.log(author);
    author.save()
    .then(()=>{
        console.log('dopo il save')
        res.redirect(`authors`)
    })
    .catch((err)=>{
        console.log(err)
        res.render('authors/new',{
            author:author,
            errorMessage:'Errore durante la creazione'
        })
    })
})
        /*(error, newAuthor)=>{
        console.log("siamo nel author.save")
        if(error){
            res.render('authors/new',{
                author:author,
                errorMessage:'Errore durante la creazione'
            })
        }else{
            //res.redirect(`authors/${newAuthor.id}`)
            res.redirect(`authors`)
        }
    })
})*/
module.exports = router ;