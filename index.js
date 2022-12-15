const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

// database configuration
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

// test your database
db.connect()
    .then(obj => {
        console.log('Database connection successful'); // you can view this message in the docker compose logs
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.listen(3000);
console.log('Server is listening on port 3000');

app.get('/', (req, res) => {
    res.redirect('/anotherRoute');
});

app.get('/anotherRoute', (req, res) => {
    res.redirect('/index')
});

app.get("/index", (req, res) => {
    res.render("pages/index");
});

app.get("/countdown", (req, res) => {
    res.render("pages/countdown");
});

app.get("/phone_list", (req, res) => {
    let query = `SELECT * FROM events;`;
    db.any(query)
        .then((events) => {
            res.render("pages/phone_list", {
                events,
            });
        })
        .catch((error) => {
            res.render("pages/phone_list", {
                message: `Events Failed to Load`,
            });
        });
});

app.get("/gallery", (req, res) => {
    let query = `SELECT * FROM images;`;
    db.any(query)
        .then((images) => {
            res.render("pages/gallery", {
                images,
            });
        })
        .catch((error) => {
            res.render("pages/gallery", {
                message: `Gallery Failed to Load`,
            });
        });
});