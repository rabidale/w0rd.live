var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    methodOverride   = require("method-override"),
    nodemon          = require("nodemon"),
    expressSanitizer = require('express-sanitizer');
    
    
// mongoose.connect("mongodb://localhost:27017/w0rd-live", {useNewUrlParser: true});
mongoose.connect("mongodb://rabidale:2725Gregory@ds263791.mlab.com:63791/w0rd-live", {useNewUrlParser: true});
// var indexRoutes = require("./routes/index");
// var loginRoutes = require("./routes/login");
// var createRoutes = require("./routes/create");

//SCHEMA SET UP
var w0rdSchema = new mongoose.Schema({
    word: String,
    backgroundColor: String,
    fontColor: String,
    fontStyle: String
});

var W0rd = mongoose.model("W0rd", w0rdSchema);

// W0rd.create(
//     {
//         word: "pizza",
//         backgroundColor: "blue"
        
//     }, function(err, w0rd){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("w0rd has been made");
//             console.log(w0rd);
//         }
//     });


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressSanitizer()); 

app.use(express.static(__dirname + "/public"));

//ROOT ROUTE
app.get("/", function(req, res){
    //Get all w0rds from DB
    W0rd.find({}, function(err, allW0rds){
        if(err){
            console.log(err);
        } else {
            res.render("home", {w0rds: allW0rds});
        }
    });
});

//POST ROUTE
app.post("/", function(req, res){
    //get data from form and add to object
    req.body.word = req.sanitize(req.body.word);
    var word = req.body.word;
    var backgroundColor = req.body.backgroundColor;
    var fontColor = req.body.fontColor;
    var fontStyle = req.body.fontStyle;
    var newW0rd = {word: word, backgroundColor: backgroundColor, fontColor: fontColor, fontStyle: fontStyle};
    //Create new w0rd and save to DB
    W0rd.create(newW0rd, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to index page
            res.redirect("/"); 
        }
    });
});

//CREATE ROUTE
app.use("/create", function(req, res){
    res.render("create");
});


//ABOUT ROUTE
app.get("/about", function(req, res){
    res.render("about");
});

//When routing is set back up use these
// app.use("/", indexRoutes);
// app.use("/login", loginRoutes);
// app.use("/create", createRoutes);
//

//APP START NOTIFICATION   
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("App has been launched.");
});