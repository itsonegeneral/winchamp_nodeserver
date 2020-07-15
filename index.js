const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var app = express();
const mUser = require('./modules/users');
const fs = require('fs');

var mysqlConnection = mysql.createConnection({
    host:'mysql5021.site4now.net',
    user : 'a56f9c_betting',
    password:'bettingdatabase1',
    port:'3306',
    database : 'db_a56f9c_betting'
}); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//to remove the huge latency of serving web pages
app.use(express.static(__dirname + '/html'));

app.listen(process.env.PORT||8080,()=>console.log('Listening to port %d',process.env.PORT ===NaN?process.env.PORT:8080));


mysqlConnection.connect((err)=>{
    if(!err){
    console.log('Connected');
    setInterval(()=>{
        console.log("Server refreshed");
        mysqlConnection.query("SELECT * from games");
    },7000);
    }else{
        console.log("Failed with errorno :"+err.errno + " and Errorcode : "+ err.code);
        mysqlConnection.connect((err)=>{});
    }
});

app.get('/',(req,res)=>{
    res.json({
        message : "success"
    })
});

app.post('/gameplay/joingame',(req,res)=>{
    let gameid = parseInt(req.body.gameid);
    let playerid = req.body.playerid;
    let amount = parseInt(req.body.amount);
    let symbol = req.body.code;
    let date = getCurrentDate();
    if(playerid === undefined){
        res.json({
            message : "Parameters unsatisfied"
        })
    }
    let query = "INSERT INTO gamebets (playerid,symbol,amount,gameid) VALUES ('"+playerid+"','"+symbol+"',"+amount+","+gameid+");";
    let query2 = "UPDATE users SET balance = balance-"+ amount+" WHERE id='"+playerid+"';";


    mysqlConnection.beginTransaction((err)=>{

        if(err){
          console.log(err);
          res.json({status:"Failed to join"});
        }else{

            mysqlConnection.query(query,(err,rows,fields)=>{
                if(err){
                    mysqlConnection.rollback(()=>{
                        console.log("Rolled back at joining")
                        res.json({status:"Failed to join"});
                    });
                }else{
                    mysqlConnection.query(query2,(err,rows,fields)=>{
                        if(err){
                            mysqlConnection.rollback(()=>{
                                res.json({status:"Failed to join"});
                            });
                        }else{
                            res.json({status:"Joined Successfully!"});
                        }
                    });
                }
            });

        }
    });
});


app.get('/getcurrentmatch',(req,res)=>{
    let query = "SELECT * FROM games WHERE id<=(SELECT max(id) FROM games) ;";
    mysqlConnection.query(query,(err,rows,fields)=>{
        if(err){
            console.log(err);
            res.json(err);
        }else{
            res.json({
                data : JSON.parse(JSON.stringify(rows))
            });
        }
    });
});

app.post('/users/user',(req,res)=>{
    mUser.user(req,res,mysqlConnection);
});

getCurrentDate = function(){
    var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Shanghai"});

    return (new Date(asiaTime)).toISOString();
}