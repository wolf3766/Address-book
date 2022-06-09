//npm packages

const express = require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const _=require("lodash");
const mongoose= require("mongoose");
const bcrypt = require("bcrypt");
const { response } = require("express");
const cookieParser=require("cookie-parser")
const session= require("express-session");
const jwt=require("jsonwebtoken");

const app = express();
app.use(express.json()); //to parse data in json
app.use(cors({ // to make browser send data on different hosts 
    origin:["http://localhost:3000"],
    methods:["Get","Post"],
    credentials: true
}));

app.use(bodyParser.urlencoded({ //to parse the data recieved with api
    extended:true
}));
app.use(bodyParser.json());
app.use(cookieParser()); // to generate cookies
app.use(session({ //to generate sessions;
    key:"userID", 
    secret:"vouchdigital",
    resave:false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000*60*60*24,
    }
}));

const saltRounds = 10; //times salting for hashing 
mongoose.connect("mongodb://localhost:27017/addressbook") //database url (mongodb)

const addressbookSchema={ //database schema 
    Name:String,
    address:String,
    city:String,
    state:String,
    zip:Number
  }

  const usercredentialSchema={ //login details schema
      email:String, 
      password:String
  }

  //Models 
const contact=mongoose.model("contact",addressbookSchema);  
const user=mongoose.model("user",usercredentialSchema);

const verifyjwt=(req,res,next)=>{ //function to verify JWT token 
    const token=req.body.headers["x-access-token"]
    if(!token){
        throw new Error("you need a token")
    }else{
        jwt.verify(token,"jwtsecret",(err,decoded)=>{
            if(err){
                res.json({auth:false,message:"failed to authenticate"})
            }else{
                req.userId=decoded.id;
            }
            next();
        })
    } 
}


app.post("/create",verifyjwt,(req,res)=>{ // adding data to database
    //console.log(req.body.headers);
    const newcontact=new contact({
        Name:_.capitalize(req.body.NAME),
          address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            zip:req.body.zip
    }); 
    newcontact.save();
    res.send("contact created ! ")
})

app.post("/update",verifyjwt,(req,res)=>{ //updating data at the database
    console.log("update ! ",req.body);
    contact.updateOne({_id:req.body._id},{$set :{ Name:_.capitalize(req.body.NAME), // updateone function to find details of contact with id 
                                                    address:req.body.address,
                                                    city:req.body.city,
                                                    state:req.body.state,
                                                    zip:req.body.zip}
                                                },function(err,docs){ //error handling
                                                    if(err){
                                                        console.log(err);
                                                    }else{
                                                        console.log("updated docs : ",docs);
                                                        res.send("updated ! ")
                                                    }
                                                });
});
   
app.post("/delete",verifyjwt,(req,res)=>{ //deleting data from the database
    //console.log("deleted",req.body)
    contact.findByIdAndDelete(req.body._id,(err)=>{
        res.send("deleted");
        if(err){
            console.log(err);
        }
    })
})

app.get("/search",(req,res)=>{ // searching contacts in database
   contact.find((err,foundlist)=>{
       res.send(foundlist);
       if(err){
           console.log(err);
       }
   });
});

// authentication using JWT


app.post("/usercred",(req,res)=>{ // storing user credentials
    const pass=req.body.Password;

    bcrypt.hash(pass,saltRounds,(err,hash)=>{  //storing password after encrypting
        const newuser= new user({
            email:req.body.Email,
            password:hash
        })
        newuser.save();
        res.send(" cred saved !");
    })
})

app.post("/login",async (req,res)=>{ //hadnling login request
   const User=await user.findOne({email: req.body.Email}); //finding user with details provided 
   
    bcrypt.compare(req.body.Password,User.password, (err,response)=>{  //compare user typed password with database encrypted password
        if(response){
            const id=User._id
        const token=jwt.sign({id},"jwtsecret",{ // signing JWT request, generating token
        expiresIn: 1000*60*60*24 // setting expire time to 1 day
        })
            req.session.user=User;   // sending user current status 
            res.json({auth: true,token:token});
        }else{
            console.log({auth:false});
        }
    })
})

app.get("/login",(req,res)=>{ // seding the status of login to user
    if(req.session.user){
        //console.log(req.session.user)
        res.send({loggedIn: true, user:req.session.user});
    }else{
        res.send({loggedIn:false});
    }
})

app.get("/auth",verifyjwt,(req,res)=>{ // verifying token on click
   res.send("autheticated");
})

const PORT = process.env.PORT || 8080; // setting port to 8080

app.listen(PORT, console.log(`Server started on port ${PORT}`));