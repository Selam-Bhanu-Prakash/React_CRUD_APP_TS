const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
})

app.get("/", (req, res) =>{
    // const sqlInsert = "Insert into contacts (name,email,contactNo) values ('prakash','bhanu4480@gmail.com',8096920610)";
    // db.query(sqlInsert,(err,result)=>{
    //     console.log("error ",err);
    //     console.log("reult ",result);
    //     res.send("Get Root");
    // });
    
});



app.get("/api/get", (req, res) =>{
    const sqlGet = "select * from contacts";
    db.query(sqlGet,(err,result)=>{
        console.log("error ",err);
        console.log("reult ",result);
        res.send(result);
    });
    
});

app.post("/api/post", (req, res) =>{
    const {name,email,contactNo} = req.body;
    const sqlInsert = "Insert into contacts (name,email,contactNo) values (?,?,?)";
    db.query(sqlInsert,[name,email,contactNo],(err,result)=>{
        if(err){
            console.log(err);
        }
    });
    
});

app.delete("/api/remove/:id", (req, res) =>{
    const {id} = req.params;
    const sqlRemove = "delete from contacts where id = ?";
    db.query(sqlRemove,id,(err,result)=>{
        if(err){
            console.log(err);
        }
    });
    
});

app.get("/api/get/:id", (req, res) =>{
    const {id} = req.params;
    const sqlGet = "select * from contacts where id = ?";
    db.query(sqlGet,id,(err,result)=>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
    
});

app.put("/api/update/:id", (req, res) =>{
    console.log("In Update Service");
    const {id} = req.params;
    const {name, email, contactNo} = req.body;
    const sqlUpdate = "update contacts set name = ?, email = ?, contactNo = ? where id = ?";
    console.log("sqlUpdate: ",sqlUpdate);
    db.query(sqlUpdate,[name, email, contactNo, id],(err,result)=>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
    
});

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Vbhanupr#3",
    database: "crud_contact"
})