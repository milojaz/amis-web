// modules
var express = require("express");
var app = express();
var cors = require('cors');
var firebase = require("firebase-admin");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
var session = require("express-session");
var expressValidator = require("express-validator");
var passport = require("passport");
var bodyParser = require("body-parser");
var fileupload = require("express-fileupload");

// loading the json files
var farmerDataFile = require("./app/data/farmers_data.json");
var availableProductData = require("./app/data/available_products.json");


var info = require("./app/data/infos.json");

// requiring passport
require('./app/config/passport')(passport);

// getting the sevicekey
// var serviceAccount = require("./greentaCollectServiceAccountKey.json");
var serviceAccount = require("./amisproject-29c95-firebase-adminsdk-lfydx-042dd543c7");

// initializing the app
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://amisproject-29c95.firebaseio.com"
});

//connecting to mongodb
// OFFLINE CONNECTION
// mongoose.connect("mongodb://localhost/amisapp", {
//         useNewUrlParser: true
//     })
//     .then(() => console.log("MongoDB Local Connection Successful"))
//     .catch(err => console.log(err));

// ONLINE CONNECTION TO MONGO ' + process.env.MONGO_ADMIN_PW + '
MONGO_URI = 'mongodb+srv://milojus:nauhzYBZpvigh8Vk@amismaf-cluster-udfcn.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Online Connection Successful'))
    .catch(err => console.log(err));

// getting access to the database
var db = firebase.database();
var ref = db.ref("amisproject-29c95"); //making a reference of the database

// greenta-collect

// app.set('varRef',ref);
var usersRef = ref.child("farmers");
usersRef.set({});

//setting an environment variable
app.set("port", process.env.PORT || 3000);

//setting up a view engine
app.set("view engine", "ejs");
app.set("views", "./app/views"); //specifying the view folder location

app.locals.siteTitle = "AMISMAF";

//accessing the static files
app.use(express.static("./app/public"));

app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set("appData", farmerDataFile);
app.set("availableProducts", availableProductData);
app.set("info", info);


// Express Session Middleware
app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Middleware
app.use(flash());

// Flash Middleware Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// allowing cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


// Express Validator Middleware
// app.use(expressValidator());
app.use(
    expressValidator({
        errorFormatter: function (param, msg, value) {
            var namespace = param.split("."),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += "[" + namesapce.shift() + "]";
            }
            return {
                param: formParam,
                message: msg,
                value: value
            };
        }
    })
);


// Body parser Middleware
app.use(cookieParser());


// fileupload middleware
app.use(fileupload());

// Creating access to the routes
const adminRoutes = require("./app/routes/adminRoutes");
const defaultRoutes = require("./app/routes/defaultRoutes");

app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);

//listening to the 3000 port
var server = app.listen(app.get("port"), function () {
    console.log("listening on port " + app.get("port"));
});