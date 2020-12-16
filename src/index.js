const express = require('express');
const {connectionURL,db} =require('../configurations/configuration');
const signup = require('../routes/signup');
const login = require('../routes/login');
const authUser=require('../routes/auth');
const logoutUser=require('../routes/logout');
const usersData=require('../routes/usersData');
const blockedUser=require('../routes/blockeduser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http=require('http');
require('../db/mongoose');

const app = express();

const server=http.createServer(app);

const port =process.env.PORT || 3001

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://user-registration-react.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cookieParser());
app.use(session({
    secret:'secretissecret',
    resave:true,
    saveUninitialized:true,
    store:new MongoStore({url:`${connectionURL}/${db}`,
    collection: 'sessions' }),
    cookie: { httpOnly: false, maxAge: 86400000 }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(signup());
app.use(login(passport,LocalStrategy))
app.use(authUser());
app.use(logoutUser());
app.use(usersData());
app.use(blockedUser());

server.listen(port, () => {
    console.log(`server listening in port${port}`)
})
