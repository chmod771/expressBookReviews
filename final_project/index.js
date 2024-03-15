const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const cookieParser = require('cookie-parser');
const JWT_SECRET = "simpleSecret"

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
const jwtToken = 'jwtToken';
let token = req.cookies[jwtToken];
    jwt.verify(token, JWT_SECRET, (err,user)=>{
        if(!err){
            req.user = user;
            next();
        }
        else{
            return res.status(403).json("Unauthorized")
        }
     });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
