

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