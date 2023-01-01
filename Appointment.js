const { MongoClient } = require('mongodb');
const  ObjectID = require('mongodb').ObjectId;

var uri = 'mongodb+srv://osama:p4dFB4OCV3hbxHKs@cluster0.txsjl.mongodb.net/workshop?authSource=admin&replicaSet=atlas-vbzzgl-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const client = new MongoClient(uri)


//Add new
//client id, date ,time, category, discription, status
const Insert = async function (cid,date,time,cat,disc){

    await client.connect()
    const db =  client.db('workshop');
    const items = db.collection('appointments');

    const data = {
        cid:cid,
        date:date,
        time:time,
        cat:cat,
        disc:disc,
        status:"pending"
        
      }

      await items.insertOne(data);
      client.close();
      return;


}

//Status Update
const Edit = async function(id,new_status){

    await client.connect()
    const db =  client.db('workshop');
    const items = db.collection('appointments');

    const filter = {_id: ObjectID(id) }
    const new_values = {
        $set:{ status:new_status}
      }

      await items.updateOne( filter,new_values, await function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            console.log(res)
            client.close();
          }
          

      )
      return;
}

//Get Client appointments
const Get = async function(cid){
    await client.connect();
    const DB = client.db('workshop');
    const collection = DB.collection('appointments');

    const list = await collection.find({cid:cid},).toArray();
    client.close();
    return list

}

//Get All appointments
const Get_All = async function(cid){
    await client.connect();
    const DB = client.db('workshop');
    const collection = DB.collection('appointments');

    const list = await collection.find({},).toArray();
    client.close();
    return list

}

// Delete Appointment
const Delete  = async function(id){

    await client.connect();
    const DB = client.db('workshop');
    const collection = DB.collection('appointments');
    await collection.deleteOne({_id : ObjectID(id)});
    client.close();

}


module.exports = {

    Insert:Insert,
    Edit:Edit,
    Get:Get,
    Get_All:Get_All,
    Delete:Delete
}
