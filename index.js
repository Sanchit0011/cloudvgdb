const express = require('express');
const app = express();
const http = require('http');

app.use(express.json());
app.use(express.static('assets'));
const fetch = require('node-fetch');

const {
    Pool,
    Client
} = require('pg');
// const connectionString = 'postgressql://postgres:SanSak12$@35.189.57.230:5432/vgdb';

userkey = "";

// const pool = new pool({
//     connectionString: connectionString
// });

// pool.connect()

const pool = new Pool({
    user: 'postgres',
    host: '35.189.57.230',
    database: 'vgdb',
    password: 'SanSak12$',
    port: 5432,
    idleTimeoutMillis: 20000,
    max: 90
  })


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/assets/html/vgdb.html');
});


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

var options = {
    host: 'https://vgdbmicro.appspot.com',
    port: 8080,
    path: '/getkey',
    method: 'GET'
  };
  
  http.request("http://vgdbmicro.appspot.com/getkey", function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      userkey = JSON.parse(chunk).key;
    });
  }).end();

app.get('/getdata', (req, res) => {
    const genreid = req.params.genreid;
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    )
    fetch("https://api-v3.igdb.com/games", {
            headers: {
                "user-key": userkey,
                Accept: "application/json"
            },
            method: "POST",
            body: 'fields *, screenshots.*; where genres = 13 | genres = 4 | genres = 15 | genres = 31 | genres = 5; limit 50;'
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get('/getdata/:genreid', (req, res) => {
    const genreid = req.params.genreid;
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    )
    fetch("https://api-v3.igdb.com/games", {
            headers: {
                "user-key": userkey,
                Accept: "application/json"
            },
            method: "POST",
            body: 'fields *, screenshots.*; where genres = ' + genreid + ';'
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get('/getGameData/:id', (req, res) => {
    const id = req.params.id;
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    )
    fetch("https://api-v3.igdb.com/games", {
            headers: {
                "user-key": userkey,
                Accept: "application/json"
            },
            method: "POST",
            body: 'fields *, screenshots.*; where id = ' + id + ';'
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            console.log(err);
        })
});



app.post('/markasfavorite', (req, res) => {

    const {
        game_id,
        game_name,
        genre,
        username
    } = req.body
    pool.query('INSERT INTO FAVORITES (game_id, game_name, genre, username) VALUES ($1, $2, $3, $4)', [game_id, game_name, genre, username], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`Favorite game for ${username} has been added`);
    })


});

app.delete('/unmarkfavorite/:game_name/:username', (req, res) => {
    const game_name = req.params.game_name;
    const username = req.params.username;
    pool.query('DELETE FROM FAVORITES WHERE username = $1 AND game_name = $2', [username, game_name], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`${game_name} for ${username} has been deleted`);
    })
});

app.get('/getfavorites/:username', (req, res) => {
    const username = req.params.username;
    pool.query('SELECT * FROM FAVORITES WHERE username = $1', [username], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows);
    })
});

app.get('/visualize', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    )
    pool.query('SELECT genre as label, COUNT(*) as value FROM favorites GROUP BY genre;', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows);
    })
});

app.get('/visualize2', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    )
    pool.query('SELECT game_name as label, count(*) as value from favorites group by game_name limit 5;', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows);
    })
});

app.post('/user_registration', (req, res) => {

    const {
        username,
        password,
        firstname,
        lastname
    } = req.body
    pool.query('INSERT INTO usersreg (username, password, firstname, lastname) VALUES ($1, $2, $3, $4)', [username, password, firstname, lastname], (error, results) => {
        if (error) {
            res.status(201).send('Username already exists');
        }
        else {
            res.status(201).send('Success');
        }
        
    })
});

app.post('/login', (req, res) => {

    const {
        username,
        password
    } = req.body
    pool.query('SELECT * FROM usersreg WHERE username like $1 and password like $2', [username, password], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rowCount > 0) {
            res.status(200).send('Credentials valid');
        } else {
            res.status(200).send('Invalid credentials');
        }
    })
});

app.get('/getusers', (req, res) => {
    pool.query('SELECT * FROM usersreg;',  (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows);
    })
});


const server = app.listen(8080, () => {
    console.log('Listening on port 8080');
});