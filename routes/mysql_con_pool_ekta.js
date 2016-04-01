/**
 * New node file
 */
var ejs= require("ejs");
var mysql= require("mysql");

var pool = mysql.createPool({

	connectionLimit: 1000,
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'twitter_schema',
	port	: 3306,
	debug : false
});



function getConnection()
{  
	var connection = mysql.createConnection({      
		host     : 'localhost', //host where mysql server is running      
		user     : 'root', //user for the mysql application     
		password : 'root', //password for the mysql application   
		database : 'twitter_schema', //database name     
		port  : 3306 //port, it is 3306 by default for mysql  }); 
	});
	return connection;
}

function fetchData(callback,sqlQuery)
{    
	console.log("\nSQL Query::"+sqlQuery);  


	pool.getConnection(function(err,connection){

		if(err){
			connection.release;
			return;
		}

		connection.query(sqlQuery, function(err, rows, fields){ 
			if(err)
			{    
				console.log("ERROR: " + err.message);  
			}  
			else   
			{ // return err or result    
				console.log("DB Results:"+rows);   
				callback(err, rows);  
			}
		}
		); 

	});

}

function insertData(sqlQuery,inputJSON,callback)
{
	console.log("\n SQL Query:"+sqlQuery);

	pool.getConnection(function(err,connection){

		if(err){
			connection.release;
			return;
		}

		connection.query(sqlQuery,inputJSON,function(err,result){
			if(err)
			{    
				console.log("ERROR: " + err.message);  
				console.log("insert1");
			}  
			else   
			{ // return err or result    
				console.log("Inserted Successfully in MySql"); 
				callback(err, result);
			}
		});
	});
}


exports.insertDataWithoutJSON = function(sqlQuery,callback)
{

	console.log("\n SQL Query:"+sqlQuery);

	pool.getConnection(function(err,connection){

		if(err){
			connection.release;
			return;
		}
		connection.query(sqlQuery,function(err,result){
			if(err)
			{    
				console.log("ERROR: " + err.message);  
				console.log("insert1");
			}  
			else   
			{ // return err or result    
				console.log("Inserted Successfully in MySql"); 
				callback(err, result);
			}
		});
	});
}

exports.deleteData =  function(sqlQuery,callback)
{

	console.log("\n SQL Query:"+sqlQuery);


	pool.getConnection(function(err,connection)
			{

		if(err){
			connection.release;
			return;
		}

		connection.query(sqlQuery,function(err,result){
			if(err)
			{    
				console.log("ERROR: " + err.message);  
				console.log("insert1");
			}  
			else   
			{ // return err or result    
				console.log("Inserted Successfully in MySql"); 
				callback(err, result);
			}
		});
			})
}

exports.updateData =  function(sqlQuery,callback)
{

	console.log("\n SQL Query:"+sqlQuery);

	pool.getConnection(function(err,connection){

		if(err){
			connection.release;
			return;
		}

		connection.query(sqlQuery,function(err,result){
			if(err)
			{    
				console.log("ERROR: " + err.message);  
				console.log("insert1");
			}  
			else   
			{ // return err or result    
				console.log("updated Successfully in MySql"); 
				callback(err, result);
			}
		});
	});
}


exports.fetchData=fetchData; 
exports.insertData=insertData; 