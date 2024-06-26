import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { Console } from "console";

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


var likeDis = [
    {id:1,like:20,dislike:0},
];

app.get("/", async(req, res) => {
  try {
    const result = await axios.get("https://v2.jokeapi.dev/joke/Any");
    console.log(result.data);
    var like = 0;
    var dislike = 0;

    let obj = likeDis.find((o, i) => {
        if (o.id == result.data.id) {
            // likeDis[i] = { id: o.id, like: o.like +1, dislike: o.dislike };
            // stop searching
            like = o.like;
            dislike = o.dislike;
            return true;
        }
    });
    console.log(obj);
    if(obj === undefined){
        likeDis.push({
            id:result.data.id,
            like:0,
            dislike:0
        });
    }

console.log(likeDis);
   res.render("index.ejs",{data:result.data,like:like,dislike:dislike});
  } catch (error) {
    console.log(error.response);
    res.status(500);
  }

 });

 app.post("/", async(req, res) => {
    // console.log(req.body.like);
    const likdis = parseInt(req.body.like);
var like=0;
var dislike = 0;
    if(likdis == 1){
// meaning liked the post
let obj = likeDis.find((o, i) => {
    if (o.id == parseInt(req.body.id)) {
        likeDis[i] = { id: o.id, like: o.like +1, dislike: o.dislike };
        return true; // stop searching
    }
});
console.log(obj);
if(obj === undefined){
        likeDis.push({
            id:parseInt(req.body.id),
            like:1,
            dislike:0
        });
    }

    }else if(likdis == 0){
//disliked the post

let obj = likeDis.find((o, i) => {
    if (o.id == parseInt(req.body.id)) {
        likeDis[i] = { id: o.id, like: o.like, dislike: o.dislike +1 };
        return true; // stop searching
    }
});

    if(obj === undefined){
          likeDis.push({
            id:parseInt(req.body.id),
            like:0,
            dislike:1
        });
    }
      
    

    }
    try {
      const result = await axios.get(`https://v2.jokeapi.dev/joke/${req.body.inlineRadioOptions}`);
      console.log(result.data);


      let obj = likeDis.find((o, i) => {
        if (o.id === result.data.id) {
            // likeDis[i] = { id: o.id, like: o.like +1, dislike: o.dislike };
            // return true; // stop searching
            like = o.like;
            dislike = o.dislike;
            return true;
        }
          
        
    });
    console.log(obj);
    if(obj === undefined){
        likeDis.push({
            id:result.data.id,
            like:0,
            dislike:0
        });
    }

    console.log(likeDis);
     res.render("index.ejs",{data:result.data,option:req.body.inlineRadioOptions,like:like,dislike:dislike});
    } catch (error) {
      console.log(error.response);
      res.status(500);
    }
  
   });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
