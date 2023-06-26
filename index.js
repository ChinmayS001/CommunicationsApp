import  Express  from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import twilio from 'twilio';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
//const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID," ",process.env.TWILIO_AUTH_TOKEN,process.env.TWILIO_NUMBER);
import bodyParser from 'body-parser'
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'templates'));

app.listen(5000, () => {
    console.log("LISTENING ON PORT 5    000")
});


app.get("/",(req,res)=>{
    res.render("form.ejs",{err:"flase"});
})



app.post("/sendMessage",async (req,res)=>{
    let number = req.body.PhoneNumber;
    const tp = req.body.type;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    let f=0;

    const client = twilio(accountSid, authToken);

    console.log("Working")

    if(tp == "message"){
    try{
    await client.messages
    .create({
    body: req.body.Message,
    from: process.env.TWILIO_NUMBER,
    to: number
    })
    .then(message => {console.log(message.sid);
    res.render("form.ejs",{err:"false"})
     f =1;})
    }
    catch{
    
        err=>{
            console.log("Error was executed");
            res.render("form.ejs",{err:"true",msg:err})
        }
    }
    }
    else if(tp=="phone"){
       try{
       await client.calls
      .create({
         url: 'http://demo.twilio.com/docs/voice.xml',
         to: number,
         from: process.env.TWILIO_NUMBER
       })
      .then(
        
        call => {res.redirect("/");f=1;}
        );
      }
      catch{
        err =>{
            res.send(err);
        }
      }

    }
    if(!f){
    const message = req.Message;
    res.render("form.ejs",{err:"true",msg:"API took too long to respond"});
    }
})