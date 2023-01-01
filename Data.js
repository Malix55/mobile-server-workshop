const { MongoClient } = require('mongodb');
const { connect } = require('mongoose');
const cli = require('nodemon/lib/cli');
const { debug, put } = require('request');
const  ObjectID = require('mongodb').ObjectId;

var uri = 'mongodb+srv://osama:p4dFB4OCV3hbxHKs@cluster0.txsjl.mongodb.net/workshop?authSource=admin&replicaSet=atlas-vbzzgl-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const c = new MongoClient(uri)
Connect();


const Get_User_Name= async function(id){
    await c.connect();
   // if(!isConnected){await Connect();}
    
    const db =  c.db('workshop');
    const users = db.collection('clients');
    const filter = {_id: ObjectID(id) }
    const x = await users.find(filter,).toArray()
    const name = x[0].firstName; 
    return name;
}

const New_Checkin = async function(id,state,date,time){
    await c.connect()
    const db =  c.db('workshop');
    const chkins = db.collection('checkins');
    const data = {
        staff : id,
        state : state,
        Date : date,
        Time : time
      }
      
     await chkins.insertOne(data); 
     return ;
} 
const Get_Checkin_Histort = async function (id){

    await c.connect()
    const db =  c.db('workshop');
    const chkins = db.collection('checkins');
    const filter = {staff: id }
    return await chkins.find(filter,).sort({$natural:-1}).limit(10).toArray();

}



function isConnected() {
    return !!c && !!c.topology && c.topology.isConnected()
  }
async function Connect(){
    await c.connect();
    console.log("Connected"); 
    return;
}



module.exports={
    Get_User_Name:Get_User_Name,
    New_Checkin:New_Checkin,
    Get_Checkin_Histort:Get_Checkin_Histort
}