require('dotenv').config();

const  express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


app.use(express.json());

const books = [
    {
        userName:'Mani',
        title:'Into the Unknown',
        author:'XXXX',
    },
    {
        userName: 'Arkrish',
        title:'Deep into the cave',
        author: 'BBBBB',
    }
];

app.get('/books',authenticate247Token,(req,res) => {
    res.json(books.filter(p => p.userName === req.user.userName));
});



// This function checks if the authToken is validated, in each post call
// we would be passing
// Bearer AuthToken, which we get here and validate with JWT verify, it verify from sign above in login.
function authenticate247Token(req,res,next) {
    const authHeader = req.headers['authorization'];
    console.log("Header : " + authHeader);
    const authToken247 = authHeader && authHeader.split(' ')[1];
    console.log(authToken247);
    if (authToken247 == null)
        return res.sendStatus(401);
    jwt.verify(authToken247,process.env.ACCESS_TOKEN_SECRET_247,(err,user) => {
        if(err)
            return res.sendStatus(403);
        console.log('User :' + user);
        req.user = user;
        console.log("req.user = " + req.user.userName);
        next();
    })
}
app.listen(5000);
