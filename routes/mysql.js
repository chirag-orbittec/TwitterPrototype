var mysql = require('mysql');
var pool = [],poolStatus = [];
var CONNECTION_OPEN = 0, CONNECTION_BUSY = 1;
var minimumPoolSize = 10, maximumPoolSize = 100;

function createConnection()
{
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'twitter_schema',
        port : 3306
	});
	return connection;
}

function Pool()
{
	for(var i=0; i < minimumPoolSize; ++i)
	{
		pool.push(createConnection());
		poolStatus.push(CONNECTION_OPEN);
	}
}

function addConnectionToPool()
{
	pool.push(createConnection());
	poolStatus.push(CONNECTION_OPEN);
}

Pool.prototype.getConnection = function()
{
	var poolExausted = true;
	var poolJSON;
	for(var j = 0 ; j < pool.length ; j++)
	{
		if(poolStatus[j] === CONNECTION_OPEN)
		{
			poolStatus[j] = CONNECTION_BUSY;
			poolExausted = false;
			poolJSON = [{poolObject: pool[j],poolObjectLocation: j}];
			return poolJSON;
		}
	}

	if(poolExausted && pool.length < maximumPoolSize)
	{
		addConnectionToPool();
		poolStatus[pool.length-1] = CONNECTION_BUSY;
		poolExausted = false;
		poolJSON = [{poolObject: pool[pool.length-1],poolObjectLocation: jCount}];
		return poolJSON;
	}
};

Pool.prototype.releaseConnection = function(connectionObjectLocation)
{
	if(poolStatus[connectionObjectLocation] === CONNECTION_BUSY)
	{
		poolStatus[connectionObjectLocation] = CONNECTION_OPEN;
	}
};

var p = new Pool();


exports.fetchData = function(callback,sqlQuery)
{    
	console.log("\nSQL Query::"+sqlQuery);  
	

	var connectionFromPool = p.getConnection();
	var connection = connectionFromPool[0].poolObject;
	var connectionLocation = connectionFromPool[0].poolObjectLocation;

	
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
	console.log("\nConnection closed..");  
	p.releaseConnection(connectionLocation);
}

exports.insertData = function(sqlQuery,inputJSON,callback)
{
	console.log("\n SQL Query:"+sqlQuery);


	var connectionFromPool = p.getConnection();
	var connection = connectionFromPool[0].poolObject;
	var connectionLocation = connectionFromPool[0].poolObjectLocation;

	
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
	
	p.releaseConnection(connectionLocation);
}


exports.insertDataWithoutJSON = function(sqlQuery,callback)
{

	console.log("\n SQL Query:"+sqlQuery);

	var connectionFromPool = p.getConnection();
	var connection = connectionFromPool[0].poolObject;
	var connectionLocation = connectionFromPool[0].poolObjectLocation;

	
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
	
	p.releaseConnection(connectionLocation);
}

exports.deleteData =  function(sqlQuery,callback)
{

	console.log("\n SQL Query:"+sqlQuery);

	var connectionFromPool = p.getConnection();
	var connection = connectionFromPool[0].poolObject;
	var connectionLocation = connectionFromPool[0].poolObjectLocation;
	
	connection.query(sqlQuery,function(err,result){
		if(err)
		{    
			console.log("ERROR: " + err.message);  
			console.log("insert1");
		}  
		else   
		{ // return err or result    
			console.log("Deleted Successfully in MySql"); 
			callback(err, result);
		}
	});
	
	p.releaseConnection(connectionLocation);
}

exports.updateData =  function(sqlQuery,callback)
{

	console.log("\n SQL Query:"+sqlQuery);

	var connectionFromPool = p.getConnection();
	var connection = connectionFromPool[0].poolObject;
	var connectionLocation = connectionFromPool[0].poolObjectLocation;
	
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
	
	p.releaseConnection(connectionLocation);
}
