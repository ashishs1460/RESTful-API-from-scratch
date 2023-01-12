const express = require('express');
const app=express();
const bodyparser=require('body-parser');
const ejs=require('ejs');
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
const mongoose=require('mongoose');


mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema=({
    title:String,
    content:String
})

const Article=mongoose.model('Article',articleSchema)
app.route('/articles')
.get(function(req,res){
    Article.find(function(err,foundItems){
        if(!err){
            res.send(foundItems)
        }else{
            res.send(err)
        }
    })
})
.post(function(req,res){
    console.log(req.body.title)
    console.log(req.body.content)
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("Sucessfully added to the database")
        }else{
            res.send(err)
        }
    })
})
.delete((req, res) => {
    Article.deleteMany()
      .then((result) => {
        res.send("All articles deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  })

app.route('/articles/:articleTitle')
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err ,foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("No such matching articles are found ")
        }
    })
})
.put(function(req,res){
    Article. update(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        
        function(err){
            if(!err){
                res.send("Sucessfully updated the article")
              
            }
        })
})
.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set: req.body },
        function(err){
            if(!err){
                res.send("Sucessfully updated a specific article")
            }else{
                res.send(err)
            }
        }
    )
})
.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Sucessfully Deleted the article")
            }else{
                res.send(err)
            }
        }
    )
})


app.listen(3000,function(){
    console.log("Server running on port 3000")
})