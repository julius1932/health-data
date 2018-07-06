const express =require('express');
const morgan =require('morgan');
const bodyParser =require('body-parser');
const cookieParser= require('cookie-parser');
const session= require('express-session');
var path =require('path');




const app =express();

// Middlewares
// set morgan to log info about our requests for development use.
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

/*app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exhbs({defaultLayout:'main'}));
app.set('view engine','handlebars');*/

// Routes
app.get("/insurancetest",function(req,res){
	  res.redirect('https://health-insurance-api.herokuapp.com');
 });
 app.get("/providerstest",function(req,res){
 	  res.redirect('https://doctor-api.herokuapp.com');
});
app.get("/insurance",function(req,res){
	 var searchValue =req.query.search;
	 if(searchValue){
	      res.redirect('https://health-insurance-api.herokuapp.com/insurance?search='+searchValue);
  }
 });
 app.get("/providers",function(req,res){
	  var searchValue =req.query.search;
		 if(searchValue){
			  res.redirect('https://doctor-api.herokuapp.com/providers?name='+searchValue);
	   }
});
//app.use('/api',require('./routes/routes'));
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
