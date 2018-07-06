var jsonfile = require('jsonfile');
const MongoClient = require('mongodb').MongoClient;
const urlll = "mongodb://localhost:27017/";

function redc(page){
var file='jdat.json';
var nPerPage=10000;
 page = page > 0 ? ( ( page - 1 ) * nPerPage ) : 0 ;
jsonfile.readFile(file, function(err, data) {
     MongoClient.connect(urlll, function(rr, db) {
         if (rr) {isfound=false; return;};
           var dbo = db.db("insurance_db");
           dbo.collection("insur").find().toArray(function(errr, reslts) {//.skip(page).limit(nPerPage)
             console.log(page+' ==='+reslts.length);
              reslts.forEach(function(row){
                    if(!data[row.st]){
                     data[row.st]={};
                    }
                    if(data[row.st][row.cr]){
                     var isThere=false;
                     data[row.st][row.cr].forEach(function(tm){
                       if(row.pid===tm){

                         isThere=true;
                         return;
                       }
                     });
                     if(!isThere){
                        data[row.st][row.cr].push(row.pid);
                     }
                   }else{
                     data[row.st][row.cr]=[row.pid];
                   }
                });
                jsonfile.writeFile(file,data, {spaces: 2}, function (err) {
                     console.error(err+' ==');
                });

           });
     });
});
}

function jSearch(st,cr,regx,res){
    jsonfile.readFile('./insurance/jdata.json', function(err, data) {
      if(err){
        console.log(err);
        return;
      }
      console.log(st);
      var arr0=[];
      var arr1=[];
      var arr2=[];
      if(st){
         var mStData=data[st.toUpperCase()];
         if(! mStData){
           mStData={};
         }
         Object.keys(mStData).forEach(function(key) {
           if(new RegExp(regx.toLowerCase()).test(key.toLowerCase())){
               if(key.toLowerCase()===cr){
                   arr0.push({cr:key,st:st,pid:mStData[key].length,pids:mStData[key]});
               }else if(key.toLowerCase().startsWith(cr)){
                   arr1.push({cr:key,st:st,pid:mStData[key].length,pids:mStData[key]});
               }else{
                    arr2.push({cr:key,st:st,pid:mStData[key].length,pids:mStData[key]});
               }
           }
         });
        }else {
           Object.keys(data).forEach(function(st) {
              var mStData=data[st];
              Object.keys(mStData).forEach(function(key) {
                 if(new RegExp(regx.toLowerCase()).test(key.toLowerCase())){
                      if(key.toLowerCase()===cr){
                         arr0.push({cr:key,st:st,pid:mStData[key].length,pids:mStData[key]});
                      }else if(key.toLowerCase().startsWith(cr)){
                         arr1.push({cr:key,st:st,pid:mStData[key].length,pids:mStData[key]});
                     }else{
                         arr2.push({cr:key,st:st,pid:mStData[key].length,pids:mStData[key]});
                     }
                 }
              });
            });
         }
         arr0=arr0.concat(arr1);
         arr0=arr0.concat(arr2);
         console.log(arr0.length);
         res.jsonp(arr0);
    });
  }
module.exports = jSearch;
