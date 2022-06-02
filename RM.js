
const { MongoClient } = require('mongodb');
const { debug, put } = require('request');
const  ObjectID = require('mongodb').ObjectId;

var uri = 'mongodb+srv://osama:p4dFB4OCV3hbxHKs@cluster0.txsjl.mongodb.net/workshop?authSource=admin&replicaSet=atlas-vbzzgl-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const client = new MongoClient(uri)

class Members{

    Members(name,_id,score){
        this.name = name;
        this.id = id;
        this.score =score;
    }

}

const Get_User_By_Id = async function(id){
    await client.connect()
    const db = client.db('admin')
    const users = db.collection('users')
    const filter = {_id: ObjectID(id) }
    const list = await users.findOne(filter);

    client.close();
    return list;
}



// update status of User
const Update_Status = async function Update_Status(id, state){  


    await client.connect()
    const db =  client.db('admin');
    const items = db.collection('users');

    const filter = {_id: ObjectID(id) }
    var new_values;
    switch (state){
    case "0": new_values = {$set:{ status:"offline"}}; break;
    case "1": new_values = {$set:{ status:"online"}}; break;
    case "2": new_values = {$set:{ status:"busy"}}; break;
    }


    await items.updateOne( filter,new_values, await function(err, res) {
        if (err) throw err;
       
        client.close();
      })
      

   
}
const New_Request = async function New_Request(id, type, discription){

    await client.connect()
    const db =  client.db('admin');
    const apts = db.collection('Remote_Appointments');
    const data = {
        client : id,
        client_name :"",
        type : type,
        discription : discription,
        Assigned_staff_id : "None",
        Assigned_staff_name :"None",
        feedback:0,
        status : "Recived"
      }
      
     await apts.insertOne(data);

     client.close;   
     return data ;
     
}

//get compatible employees---------
//Online staff
const Resolve_request = async function(type){

    var Online_staff = await Online_Staff(); 
    if(Online_staff.length == 0){ console.log("No One Avilable"); return;}
    await Assign_Score(Online_staff,type); 
    var Highest_staff = await Highest_Score(Online_staff);
    console.log(Highest_staff.name+"  ::  "+Highest_staff.Avg_Score);
    return Highest_staff._id;
  



//------------------------------------


}
const Assign_Score = async function (staff,type){
    
   staff.forEach  (async user => {
            var scr = await (Average_Score(user._id.toString(),type));
            Update_Avg_Score(user._id,scr);
            
         });

}

const Online_Staff = async function (){
    await client.connect()
    const db =  client.db('admin');
    const users = db.collection('users');
    const x = await users.find({status:'online',type:2},).toArray()
    client.close();
    return x;
    
}
//Get Average Score
const Average_Score = async function(_id,type){
    await client.connect()
    const db =  client.db('admin');
    const Remote_Appointm = db.collection('Remote_Appointments');

    const Jobs = await ( Remote_Appointm.find({Assigned_staff:_id,type:type,status:"Completed"},).toArray());
    
  
    var x = 1;
    var score = 5;
    Jobs.forEach(element => {
        score += element.feedback;
       
       x++;
    });

    var avg_Score = score/x;
  
   // client.close();
    return avg_Score;
    

}
const Update_Avg_Score = async function (_id,score){

    await client.connect()
    const db =  client.db('admin');
    const users = db.collection('users');

    const filter = {_id: ObjectID(_id) }
    const new_values = {$set:{ Avg_Score : score,}}

    await users.updateOne(filter,new_values, await function(err, res) {
        if (err) throw err;     
      })
}

const Highest_Score =async function(staff){

    var High_Scr = 0;
    var staff_member;
    
    staff.forEach( element => {
        if(element.Avg_Score > High_Scr){ High_Scr = element.Avg_Score; staff_member = element;}
    });
    return staff_member;



}


//map
const Check_In = async function(_id,state){

    await client.connect()
    const db =  client.db('admin');
    const Users = db.collection('users');
    const filter = {_id: ObjectID(_id) }
    const new_values = {$set:{ check_in:state}}

    await Users.updateOne( filter,new_values, await function(err, res) {
        if (err) throw err;
        console.log("1 document updated : "+res.acknowledged);
        client.close();
      })
}
const Set_Location = async function(_id,x,y){

    await client.connect()
    const db =  client.db('admin');
    const Users = db.collection('users');
    const filter = {_id: ObjectID(_id) }
    const new_values = {$set:{ pos_x:x,pos_y:y}}

    await Users.updateOne( filter,new_values, await function(err, res) {
        if (err) throw err;
        console.log("1 document updated : "+res.acknowledged);
        client.close();
      })
}

module.exports = {
    Update_Status:Update_Status,
    New_Request:New_Request,
    Check_In:Check_In,
    Set_Location:Set_Location,
    Resolve_request:Resolve_request

}

//New_Request ('61839ca687709260244ad6df',0,123);
//Jobs('61c8415f8d9a940fcd18d81f','Engine');..

//Resolve_request("Engine");
//Average_Score('61c8415f8d9a940fcd18d81f','Engine');