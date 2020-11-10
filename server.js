const { db, syncAndSeed, models : { Bookmark } } = require('./db');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended:false}));

app.get('/styles.css', (req, res)=> res.sendFile(path.join(__dirname, 'styles.css')));

app.get('/', (req, res) => res.redirect('/bookmarks'));

app.get('/bookmarks', async(req, res, next) => {
    try{
        const bookmarks = await Bookmark.findAll();
        res.send(bookmarks);
    }
    catch(ex){
        next(ex);
    }
})

const init = async() => {
    try{
    await db.authenticate();
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log (`listening on port ${port}`));
    }
    catch(ex){
        console.log(ex);
    }
};

init();
