const express =require('express');
const morgan =require('morgan');
const bodyParser =require('body-parser');
const cookieParser= require('cookie-parser');
const session= require('express-session');
var path =require('path');
var SpellChecker = require('simple-spellchecker');
var dictionary = SpellChecker.getDictionarySync("en-US");
//var exhbs=require('express-handlebars');
const jSearch =require('./redc');
const MongoClient = require('mongodb').MongoClient;
const urlll = "mongodb://localhost:27017/";
//const urlll = 'mongodb://junta:rootjunta123@ds117991-a0.mlab.com:17991/heroku_pv94v0fr';
//const urlll = "mongodb://junta:rootjunta123@ds163850.mlab.com:63850/insurance_db";

const app =express();

// Middlewares
// set morgan to log info about our requests for development use.
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());
 var feilds=['cr','yr','st','mt','pn'];
// Routes
app.get("/",function(req,res){
	  res.sendFile( __dirname+'/index.html');
 });
app.get('/api',function(req,res){
  //var searchValue =req.body.search;
  var searchValue =req.query.search;
  var st=req.query.st;
  if(searchValue){
    searchValue= searchValue.toLowerCase();
    var arrWords=searchValue.split(' ');
    searchValue='';
    arrWords.forEach(function(wrd){
      searchValue+=' '+wrd.trim();/*ensure only single space between words*/
    });
    searchValue=searchValue.trim();/*removing leading spaces*/
    arrWords=searchValue.split(' ');
    var rg=searchValue;
    arrWords.forEach(function(wrd){
      var sgtns = dictionary.getSuggestions(wrd,5,7);// array size , edit distance 7
      rg+='|'+wrd
      if(wrd.length>=4){
         rg+='|'+wrd.substring(0,3);/* MATCHING FIRST 3 LETTERS*/
      }
      sgtns.forEach(function(sgtn){
        if(rg){
           rg+='|'+sgtn
        }else{
          rg=sgtn;
        }
      });
    });
     console.log(rg);
    jSearch(st,searchValue,rg,res);
  }
});
module.exports = app;
