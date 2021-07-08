require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


app.use(express.json());

let refreshTokens = [];


app.post('/token',(req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null)
        return res.sendStatus(401);

    if (!refreshTokens.includes(refreshToken))
        return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRER_247, (err, user) => {
        if (err)
            return res.sendStatus(403);
        const accessToken = generateAccessToken({userName:user.userName});
        res.json({accessToken: accessToken});
    });
});

app.delete('/logout',(req,res) => {
   refreshTokens = refreshTokens.filter(t => t!=req.body.token);  // removing that token
    // there is an issue, we still have the original token valid..we need to invalidate somehow..
    res.sendStatus(204);
});

app.post('/login',(req,res) =>{
    // Ignoring the login aspects, since that is done by the OTP SMS
    const userName = req.body.userName;
    const user = {userName:userName};
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({accessToken:accessToken,refreshToken:refreshToken});
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_247, { expiresIn: '3m' })
}

function generateRefreshToken(user) {
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRER_247);
}

app.listen(4000);
