//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "There are many changes in the world today. In the US, events related to preparations for the election of 2024 are taking place. Democrats and the Deep State are trying to impeach former President Trump with political lawsuits. The war in Ukraine and Russia is still going on very fiercely. North Korea is working on nuclear deterrence with its neighbors. China is trying to annex Taiwan. Please feel free to use this online tool to keep track of your daily highlights. Click Compose on the top-right corner to start using the tool.";
const aboutContent = "This is a personal tool for creating newsletters, built by James in 2023 during the Web Development Course. This tool uses HTML, CSS, Javascript and Bootstrap for Front-End and NodeJs, MongoDB Atlas for Back-End.";

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery",false);
mongoose.connect(process.env.MONGO_URI);

// Create Schema of Post
const postSchema = new mongoose.Schema({
  title:String,
  content:String
});
const Post = mongoose.model("Post",postSchema);


app.get("/", async function(req, res){
  const tranPost = await Post.find();
  
  res.render("home", {
    startingContent: homeStartingContent,
    posts: tranPost
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){
  
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  await post.save();
  

  res.redirect("/");

});

app.get("/posts/:postName", async function(req, res){
  
  
  const requestedID = req.params.postName;
  const post = await Post.findById(requestedID);
  res.render("post",{title:post.title,content:post.content});
  

});

app.listen(PORT, function() {
  console.log("Server started and run well");
});
