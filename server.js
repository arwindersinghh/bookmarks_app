const { db, syncAndSeed, models : { Bookmark } } = require('./db');
const express = require('express');
const path = require('path');



const app = express();

app.use(express.urlencoded({ extended:false}));

app.get('/styles.css', (req, res)=> res.sendFile(path.join(__dirname, 'styles.css')));

app.get('/', (req, res) => res.redirect('/bookmarks'));

app.post('/bookmarks', async(req, res, next) => {
    try {
        const bookmark = await Bookmark.create(req.body);
        res.redirect(`/bookmarks/${ bookmark.category }`);
    }
    catch(ex) {
        next(ex)
    }
});

app.get('/bookmarks', async(req, res, next) => {
    try{
        const bookmarks = await Bookmark.findAll();
        res.send(`
        <html>
            <head>
                <link rel='stylesheet' href='styles.css'>
            </head>
            <body>
                <h1>You have (${ bookmarks.length }) bookmarks </h1>
                <form method='POST' id='user-form'>
                <input name='site' placeholder='enter site name...'/> 
                <input name='siteURL' placeholder='enter site URL...'/> 
                <input name='category' placeholder='enter site category...'/> 
                <button> Save </button>
                </form>
                <ul>
                    ${ bookmarks.map( bookmark => `
                        <li>
                        <a href='/bookmarks/${ bookmark.category }'>
                            ${bookmark.category} (${bookmarks.length})
                        </li>
                        `).join('')}
                </ul>
            </body>
        </html>
        `);
    }
    catch(ex){
        next(ex);
    }
})
app.get('/bookmarks/:category', async(req, res, next) => {
    try{
        console.log('ok')
        const bookmarks = await Bookmark.findAll();
        const bookmark = await Bookmark.findOne( { where : { category : req.params.category } });
        console.log(req.params.category);
        res.send(`
        <html>
            <head>
                <link rel='stylesheet' href='styles.css'>
            </head>
            <body>
                <h1>Bookmarks ${ bookmarks.length }</h1>
                    <p>
                    ${bookmark.siteURL} and ${bookmark.category}
                    </p>
            </body>
        </html>
        `);
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
