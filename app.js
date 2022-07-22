const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https =require("https");
const { response } = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    //  res.send("Server is up and running");
    res.sendFile(__dirname +"/signup.html");
});

app.post("/", function(req,res){
    // res.send();
    const firstName= req.body.firstName;
    const lastName= req.body.lastName;
    const email= req.body.email;
    // console.log(firstName + " " + lastName + " " + email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,

                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    // var dc ="us9";
    const url = "https://us9.api.mailchimp.com/3.0/lists/26c53a17ad";
    const options ={
        method: "POST",
        auth: "ishan1:d315dc90516ab500323e1d7b1e6105e0-us9"
    }
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200) {
            
            // res.send("Successfully Subscribed!");
            res.sendFile(__dirname + "/success.html");
        } else {
            // res.send("There was an ERR with signing up, please try again later");
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function(data){
            var mailchimpData = JSON.parse(data);
            console.log(mailchimpData);
        });

    });
    request.write(jsonData);
    request.end();
    
});

app.post("/failure.html", function(req,res){
    res.redirect("/");
})



app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running at 3000");
});

//API KEY :d315dc90516ab500323e1d7b1e6105e0-us9
// listID :26c53a17ad