const { MongoClient } = require('mongodb');
const  ObjectID = require('mongodb').ObjectId;
const { get } = require('mongoose');
var uri = 'mongodb://localhost:27017'
var uri2 = 'mongodb+srv://osama:p4dFB4OCV3hbxHKs@cluster0.txsjl.mongodb.net/workshop?authSource=admin&replicaSet=atlas-vbzzgl-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const client = new MongoClient(uri2)
//------------------------------------
//insert into inventory
//name-cost-quantity
const Insert = async function (name,cost,quantity,img){

    await client.connect()
    const db =  client.db('admin');
    const items = db.collection('Item_Shop');

    const data = {
        name : name,
        cost : parseInt (cost),
        Quantity  : parseInt(quantity),
        img : img
      }

      await items.insertOne(data);
      client.close();

}
//Get inventory
const Get = async function (){
    await client.connect()
    const db = client.db('workshop')
    const items = db.collection('products')

    const list = await items.find({},).toArray();
    
    //console.log(list)
    client.close();
    return list
   
    
    

}
//Edit inventory item
const Edit = async function(id,name,cost,quantity){

    await client.connect()
    const db =  client.db('admin');
    const items = db.collection('Item_Shop');

    const filter = {_id: ObjectID(id) }
    const new_values = {
        $set:{ name : name,
        cost : parseInt(cost),
        Quantity  : parseInt(quantity)}
      }

      await items.updateOne( filter,new_values, await function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            console.log(res)
            client.close();
          }
          

      )
}
//Get Orders List
const Get_Orders = async function (){
    await client.connect()
    const db = client.db('workshop')
    const items = db.collection('orders')

    const list = await items.find({},).toArray();
    //console.log(list)
    client.close();
    return list
   
    
    

}
//Post New Order
const New_Order = async function(items, uid, address, total_bill){

    await client.connect()
    const db = client.db('workshop')
    const orders = db.collection('orders')
   
    console.log("New Order Recived ")
   
    

    const data = {
        
        client_id:uid,
        address:address,
        items:items,
        bill:total_bill,
        status:"processing"
}

      await orders.insertOne(data);


    client.close();
}
//Find Order oF specfic Client
const Find_Order = async function(id){
    await client.connect()
    const db = client.db('workshop')
    const items = db.collection('orders')
    const list = await items.find({ client_id: id}).toArray();
   // console.log(list)
    client.close();
    return list;

}
//change order status
const Edit_Order_Status = async function(oid,state){

    await client.connect()
    const db =  client.db('admin');
    const items = db.collection('orders');

    const filter = {_id: ObjectID(oid) }

    const new_values = {$set:{ status:state}}

    await items.updateOne( filter,new_values, await function(err, res) {
        if (err) throw err;
        console.log("1 document updated : "+res.acknowledged);
        client.close();
      })


}
//Find Item
const Find = async function(name){
    await client.connect()
    const db = client.db('workshop')
    const items = db.collection('orders')
    const list = await items.find({ name: {$regex:name ,$options:"i"} }).toArray();
   // console.log(list)
    client.close();
    return list;

}

module.exports = {
    Insert:Insert,
    Get:Get,
    Edit:Edit,
    Find:Find,
    New_Order:New_Order,
    Get_Orders:Get_Orders,
    Find_Order:Find_Order,
    Edit_Order_Status:Edit_Order_Status
}
