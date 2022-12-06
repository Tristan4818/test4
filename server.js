
var path = require("path");
var express = require("express");
var senddata = require("./final.js");
var app = express();

app.use(express.urlencoded({ extended: true }));

var HTTP_PORT = process.env.port || 8080;

function onHttpStart()
{
    console.log ("Express http server listening on: " + HTTP_PORT);
}


app.get('/', (req, res)=>
{
    res.sendFile(path.join(__dirname, "finalViews/home.html"));
})

app.get('/register', (req, res)=>
{
    res.sendFile(path.join(__dirname, "finalViews/register.html"));
});

app.post('/register', (req, res)=>
{
    senddata.register(req.body)
    .then((user) => {
        res.send(user.email + " registered successfully." + "<a href="/"> Go Home</a>");
    })
    .catch(function(err){
        res.send(err);
    });
});


app.get('/signIn', (req, res)=>
{

    res.sendFile(path.join(__dirname, "finalViews/signIn.html"));
})

app.post('/signIn', (req, res)=>
{
    senddata.signIn(req.body)
    .then((user) => {
        res.send(user.email + " signed in successfully." + "<a href="/"> Go Home</a>");
    })
    .catch(function(err){
        res.send(err);
    });

})

app.use((req, res) => {
    let resText = "<h3>Error 404</h3>";
    resText += "<p><b>Page Not Found!</b></p>"
    res.status(404).send(resText);
  });


senddata.startDB()
.then(app.listen(HTTP_PORT, onHttpStart))
.catch(function(msg){
    console.log(msg);
});
