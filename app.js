import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js'
import { createRequire } from "module";
import { v4 as uuidv4 } from 'uuid';

const require = createRequire(import.meta.url);
const express = require('express');
const app = express();
app.use(express.json());

var db = new JsonDB(new Config("myDataBase.json", true, true, '/'));

app.get('/', (req, res)=>{
    res.send({message: "testing"}); 
})

app.post('/user', (req, res) =>{
    console.log(req.body);
    db.push("/user[]", req.body, true);
    res.send(req.body);
})

app.get('/user', (req, res) =>{
    var json = db.getData("/user");
    console.log(json);
    for(var i = 0; i<json.length; i++)
    {
        if(json[i].username==req.query.username)
        {
            var userfile = json[i];
        }
    }
    res.send(userfile);
})

app.post('/post', (req, res) =>{
	console.log(req.body);
    var userpost = req.body;
    userpost.id = uuidv4();
    db.push("/post[]", userpost, true);
    var json2 = db.getData("/user");
    for(var i = 0; i<json2.length; i++)
    {
        if(json2[i].username==req.body.createdBy)
        {
            var x = db.getData(`/user[${i}]/postcount`);
            x++; 
            db.push(`/user[${i}]`, {postcount: x}, false);
            console.log(x)
        }
    }
    res.send(userpost); 
})

app.get('/post', (req, res) =>{
	var posts = db.getData("/post");
    var usercontent = []; 
    console.log(posts); 
    for(var i = 0; i<posts.length; i++)
    {
        if(posts[i].createdBy == req.query.createdBy)
        {
            usercontent.push(posts[i]);
        }
    }
    res.send(usercontent);
})

app.delete('/post', (req, res) =>{
    var posts2 = db.getData("/post").filter((post)=>post.id!=req.query.id);
    db.push("/post", posts2);
    res.send(posts2); 
})

app.listen(4200, ()=> {
    console.log('listening at 4200');
})