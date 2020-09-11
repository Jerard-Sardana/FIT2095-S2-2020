//initial declarations
const express = require("express");
const bodyparser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express()
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('css'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('common'));
app.listen(8080);

//schemas

const Author = require('./models/author');
const Book = require('./models/book');

//mongoose connection

let url='mongodb://localhost:27017/libDB';

mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in mongoose connection');
        throw err;
    }

    console.log('Successully Connected');
});

//endpoints


//==author endpoints==

//index
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/addauthors', function (req, res){
    res.sendFile(__dirname + '/views/addauthor.html')
})
//add author post
app.post('/addauthorpost', function (req, res) {
    let authorDetails = req.body;
    let author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: authorDetails.firstName,
            lastName: authorDetails.lastName
       },
       dob: authorDetails.dob,
       address:{
           state: authorDetails.state,
           street: authorDetails.street,
           unit: authorDetails.unit,
       },
       pubs: authorDetails.pubs
    });
    author.save(function(err) {
        if (err){
            print(err)
        }
        else {
            print('Author Added Successfully');
        }
    })
    res.redirect('/authorlist');
});
//author list
app.get('/authorlist', function (req, res) {
    Author.find({}, function (err, authorlist){
        res.render('authorlist', {adb:authorlist});
    });
});

//update author
app.get('/updateauthor', function (req, res){
    res.sendfile(__dirname + '/views/updateauthor.html')
});

//update author post
app.post('/updateauthorpost', function (req, res){
    let updateDetails = req.body;
    Author.findByIdAndUpdate({
        _id: updateDetails.id
    }, {
        pubs: updateDetails.pubs
    }, function(err, result){
        if (err){
            res.redirect('/updateauthor');
        }
        else{
            res.redirect('/booklist');
        }
    })

});


//==book endpoints==

//add a book
app.get('/addbook', function (req, res) {
    res.sendFile(__dirname + '/views/addbook.html');
});
//add post
app.post('/newbook', function (req, res) {
    let bookDetails = req.body;
    let book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: bookDetails.title,
        isbn: bookDetails.isbn,
        author: bookDetails.authorId,
        pubdate: bookDetails.pubdate,
        summary: bookDetails.summary
    });
    book.save(function(err) {
        if (err){ 
            print(err)
        }
        else{

         print('Book Added Successfully');
        }
    })
    res.redirect('/booklist');
});
//book list
app.get('/booklist', function (req, res) {
    Book.find({}).populate('author').exec(function (err, booklist){
        res.render('booklist', {adb:booklist});
    });
});
//delete book
app.get('/deletebook', function (req, res){
    res.sendfile(__dirname + '/views/deletebook.html');
});
//delete book post
app.post('/deletebookpost', function (req, res){
    let deleteDetails = req.body;
    Book.deleteMany({isbn: deleteDetails.isbn}, function (err, result){
        if (err) {
            res.redirect('/deletebook');
        }
        else{
            res.redirect('/booklist');
        }
    });
    
});