

module.exports.user = function(req,res,con){
    let query = "SELECT * FROM users WHERE id='"+req.body.playerid+"';";
    con.query(query,(err,rows,feilds)=>{
        if(!err){
            if(JSON.parse(JSON.stringify(rows)).length != 0){
                res.json({
                    status : 'exists',
                    player : JSON.parse(JSON.stringify(rows))
                });
            }else{
                res.json({
                    status : 'new',
                    player : JSON.parse(JSON.stringify(rows))
                });
            }
        }else{
            res.json({
                status:'failed',
                error : err
            })
        }
    });
}

module.exports.createUser = function(req,res,con){
    let name = req.body.name;
    let email = req.body.email;
    let referral = req.body.referral === undefined ?"":req.body.referral;
    let id = req.body.userid;
    let phone = req.body.phone;
    
    if(name === undefined || email === undefined || id === undefined || phone === undefined){
        res.json({
            status:"error",
            message : "All parameters not satisfied"
        });
        return;
    }

    let query = "INSERT INTO users (id,playerName,email,phone,referral) VALUES ('"+id+"','"+name+"','"+email+"','"+phone+"','"+referral+"');"
    con.query(query,(err,rows,feilds)=>{
        if(err){
            res.json({
                status:"error",
                msg : err
            })
        }else{
            res.json({
                status :"success"
            });
        }
    });
}