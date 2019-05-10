var express = require('express');
var path = require('path')

var app = express();
app.use(express.static(path.join(__dirname, "public")));
app.get('/', (req,res,next)=>{
    res.end("hello word")

    
});




app.listen(3002)

