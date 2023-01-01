
const { MongoClient } = require('mongodb');
const cli = require('nodemon/lib/cli');
const { debug, put } = require('request');
const  ObjectID = require('mongodb').ObjectId;

var uri = 'mongodb+srv://osama:p4dFB4OCV3hbxHKs@cluster0.txsjl.mongodb.net/workshop?authSource=admin&replicaSet=atlas-vbzzgl-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const client = new MongoClient(uri)
const c = new MongoClient(uri)
const Location_Client = new MongoClient(uri)

class Members{

    Members(name,_id,score){
        this.name = name;
        this.id = id;
        this.score =score;
    }

}

const Get_User_By_Id = async function(id){
    await client.connect()
    const db = client.db('workshop')
    const users = db.collection('staffs')
    const filter = {_id: ObjectID(id) }
    const list = await users.findOne(filter);


    return list;
}



// update status of User
const Update_Status = async function Update_Status(id, state){  


    await client.connect()
    const db =  client.db('workshop');
    const items = db.collection('staffs');

    const filter = {_id: ObjectID(id) }
    var new_values;
    switch (state){
    case "0": new_values = {$set:{ status:"offline"}}; break;
    case "1": new_values = {$set:{ status:"online"}}; break;
    case "2": new_values = {$set:{ status:"busy"}}; break;
    }

    await items.updateOne( filter,new_values, await function(err, res) {})
      

   
}
const New_Request = async function New_Request(id, type, discription){

    await client.connect()
    const db =  client.db('workshop');
    const apts = db.collection('remoteappointments');
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
     return data ;
     
}
const Completed_Request = async function(id){

    await client.connect()
    const db =  client.db('workshop');
    const apts = db.collection('remoteappointments');
    const filter = {Assigned_staff_id :id,status:"Completed" }
    const x = await apts.find(filter).toArray();
    return x;
}

//get compatible employees---------
//Online staff
const Resolve_request = async function(type){

    var Online_staff = await Online_Staff(); 
    if(Online_staff.length == 0){ return "0";}
    await Assign_Score(Online_staff,type); 
    const Highest_staff =  await Highest_Score(Online_staff);
    return Highest_staff._id;



//------------------------------------


}
const Assign_Score = async function (staff,type){
    
   staff.forEach  (async user => {
            var scr = await (Average_Score(user._id.toString(),type));
            await Update_Avg_Score(user._id,scr);
            
         });

}

const Online_Staff = async function (){
    await client.connect()
    const db =  client.db('workshop');
    const users = db.collection('staffs');
    const x = await users.find({status:'online'},).toArray()
    client.close();
    return x;
    
}
//Get Average Score
const Average_Score = async function(_id,type){
    await client.connect()
    const db =  client.db('workshops');
    const Remote_Appointm = db.collection('remoteappointments');
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
    const db =  client.db('workshops');
    const users = db.collection('staffs');

    const filter = {_id: ObjectID(_id) }
    const new_values = {$set:{ Avg_Score : score,}}

    await users.updateOne(filter,new_values, await function(err, res) {
        if (err) throw err;     
      })
}
const Highest_Score = async function(staff){

    var High_Scr = 0 ;
    var staff_member  ;
    
    staff.forEach( element => {

        if(element.Avg_Score >= High_Scr){ 
            High_Scr = element.Avg_Score; 
            staff_member = element;}
      });
     return  await staff_member;



}

//----------------------------------------------------------
c.connect()
const db =  c.db('workshop');
const _Remote_Appointm = db.collection('remoteappointments');

const Total_Apts = async function(_id,type){

    const filter = {
        Assigned_staff_id:_id,
        type:type,
        status:"Completed"}

    var Jobs = await _Remote_Appointm.find(filter).toArray();
    return Jobs;


}
//map
Location_Client.connect();
const location_DB = Location_Client.db('workshop');

const Check_In = async function(_id,state){

    await client.connect()
    const db =  client.db('workshop');
    const Users = db.collection('staffs');
    const filter = {_id: ObjectID(_id) }
    const new_values = {$set:{ ckeckedIn:state}}

    await Users.updateOne( filter,new_values, await function(err, res) {
        if (err) throw err;
        console.log("1 document updated : "+res.acknowledged);
        client.close();
      })
}
const Set_Location = async function(_id,x,y){

    await client.connect()
    const db =  client.db('workshop');
    const Users = db.collection('staffs');
    const filter = {_id: ObjectID(_id) }
    const new_values = {$set:{ pos_x:x,pos_y:y}}

    await Users.updateOne( filter,new_values, await function(err, res) {
        if (err) throw err;
        console.log("1 document updated : "+res.acknowledged);
      })
}
const Get_Location_Staff = async function(_id){
    const Users = location_DB.collection('staffs');
    const filter = {_id: ObjectID(_id) }
    const user = await Users.findOne( filter,)
      return user;
}
const Get_Location_Client = async function(_id){
    
    
    const Users = location_DB.collection('clients');
    const filter = {_id: ObjectID(_id) }
    const user = await Users.findOne( filter,)
      return user;
}
//-------------------

//Get Set Data
const Client_Data = async function(_id){

    await client.connect()
    const db = client.db('workshop');
    const Users = db.collection('clients');
    const filter = {_id: ObjectID(_id) }

    const x = await Users.findOne(filter)
   
    return x;
} 
const Staff_Data = async function(_id){

    await client.connect()
    const db = client.db('workshop');
    const Users = db.collection('staffs');
    const filter = {_id: ObjectID(_id) }

    const x = await Users.findOne(filter)
   
    return x;
} 
const RMA_Data = async function(_id){

    await client.connect()
    const db = client.db('workshop');
    const Users = db.collection('remoteappointments');
    const filter = {_id: ObjectID(_id) }

    const x = await Users.findOne(filter)
    return x;
} 
const APT_Status= async function(_id){

    await client.connect()
    const db = client.db('workshop');
    const Users = db.collection('remoteappointments');
    const filter = {_id: ObjectID(_id) }

    var x = await Users.findOne(filter)
    return x.status;
} 
const Update_Apt_Status = async function(_id,state){

    await client.connect()
    const db = client.db('workshop');
    const apts = db.collection('remoteappointments');
    const filter = {_id: ObjectID(_id) }
    const new_values = {$set:{status:state}}
    apts.updateOne(filter,new_values);
    return;



}
const Assign_Staff = async function(_id,Staff_id){
    await client.connect()
    const db = client.db('workshop');
    const apts = db.collection('remoteappointments');
    const filter = {_id: ObjectID(_id) } 
    const new_values = {$set:{Assigned_staff_id:Staff_id}}
    apts.updateOne(filter,new_values);
     
    return;

}
const Feed_Back = async function(_id,score){
    await client.connect()
    const db = client.db('workshop');
    const apts = db.collection('remoteappointments');
    const filter = {_id: ObjectID(_id) } 
    const new_values = {$set:{feedback:score}}
    apts.updateOne(filter,new_values);
     
    return;

} 


const APT_Completed = async function(_id){
    await client.connect()
    const db = client.db('workshop');
    const apts = db.collection('remoteappointments');
    const filter = {_id: ObjectID(_id) } 
    const new_values = {$set:{status:"Completed"}}
    apts.updateOne(filter,new_values);
     
    return;

} 
const Get_RM_ATS = async function(filter){
    
    var z = _Remote_Appointm.find(filter,).toArray();
    return z;

} 




module.exports = {
    Update_Status:Update_Status,
    New_Request:New_Request,
    Check_In:Check_In,
    Set_Location:Set_Location,
    Get_Location_Staff:Get_Location_Staff,
    Get_Location_Client:Get_Location_Client,
    Resolve_request:Resolve_request,
    Client_Data:Client_Data,
    RMA_Data:RMA_Data,
    APT_Status:APT_Status,
    Update_Apt_Status:Update_Apt_Status,
    Average_Score:Average_Score,
    Total_Apts:Total_Apts,
    Assign_Staff:Assign_Staff,
    Feed_Back:Feed_Back,
    APT_Completed:APT_Completed,
    Get_RM_ATS:Get_RM_ATS,
    Staff_Data:Staff_Data,
    Completed_Request:Completed_Request
}
