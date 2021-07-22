const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var city="";
var weatherDescription="";
var imageURL="";

app.set("view engine", "ejs");

var today = new Date();
var currentDay = today.getDay();
var day=today.toLocaleDateString("en-US",{weekday:"long",day:"numeric",month:"long"});
const openWeatherAPIId="b27cfd62db69b2db178e2edb43707d31";
app.get("/", function(req,res){
    console.log("SERVER ON");
    res.sendFile(__dirname+ "/index.html");
});
app.post("/",function(req,res){
    console.log((req.body.city));
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${openWeatherAPIId}`;
    console.log("URL SENT");
    https.get(url,function(response){
        console.log(response.statusCode);
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            var apicode = weatherData.cod;
            if(apicode ==200){
                city = weatherData.name;
                var temp = weatherData.main.temp;
                weatherDescription = weatherData.weather[0].description;
                var icon = weatherData.weather[0].icon;
                
                imageURL= "https://openweathermap.org/img/wn/" + icon + "@2x.png"
                console.log(`Weather at ${city} is ${weatherDescription}`);
                res.render("index",{cityName:city,weatherDes:weatherDescription,weatherImg:imageURL});
            }
            else{
                console.log("API ERROR: CANNOT FIND CITY");
                console.log(`${apicode}`);
                imageURL="img/error.png";
                weatherDescription="Cannot find city. Please enter another City/State/Country";
                city="ERROR";
                res.render("index",{cityName:city,weatherDes:weatherDescription,weatherImg:imageURL});

            }            
        });
    });
});
app.listen(3000,function(){}); 
