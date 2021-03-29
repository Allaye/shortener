// imports 
const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortenUrl');

// instanciating and setting neccesary modules
app = express();
mongoose.connect('mongodb://127.0.0.1:27017/url',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.get('/', async (req, res)=>{
    const shortUrls = await ShortUrl.find();
    res.render('index', {shortUrls: shortUrls});
});

app.post('/urlmagics', async (req, res)=>{
    await ShortUrl.create({full: req.body.URL})
    res.redirect('/');
});

app.get('/:urlmagic', async (req, res)=>{
    const shortUrl = await ShortUrl.findOne({short: req.params.urlmagic});
    if(shortUrl == null) return res.sendStatus(404);
    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
});

// running the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log('listening on port ' + PORT);
});
