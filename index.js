const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "meow";
const app = express();
app.use(express.json());

const users = [];


app.get('/',function(req,res){

    res.sendFile(__dirname+"/index.html")

})

app.post("/signup", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })    

    res.json({
        message: "You are signed up"
    })

    console.log(users)
    
})

app.post("/signin", function(req, res) {
    
    const username = req.body.username;
    const password = req.body.password;

    // maps and filter
    let foundUser = null;

    for (let i = 0; i<users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            foundUser = users[i]
        }
    }

    if (foundUser) {
        const token = jwt.sign({
            username: foundUser.username,
            password: foundUser.password,
        }, JWT_SECRET) ;
        console.log(token);

        // foundUser.token = token;
        res.json({
            token: token
        })
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    console.log(users)
})

app.get("/me", function(req, res) {
    const token = req.headers.token; // Expecting token in custom 'token' header
    
    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const decodedInformation = jwt.verify(token, JWT_SECRET);  // {username: "harkirat@gmail.com"}
        const username = decodedInformation.username;
        let foundUser = null;

        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                foundUser = users[i];
            }
        }

        if (foundUser) {
            res.json({
                username: foundUser.username,
                password: foundUser.password
            });
        } else {
            res.status(403).json({ message: "Token is invalid" });
        }

    } catch (err) {
        res.status(403).json({ message: "Token verification failed", error: err });
    }
});


app.listen(3000)


