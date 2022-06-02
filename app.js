
const shop = require('./E-shop');
const Appointment = require('./Appointment')
const RM = require('./RM')
const chalk = require('chalk')
const http = require('http')
const express = require('express')
const cors = require('cors')
const WebSocket = require('ws');
var bodyParser = require('body-parser')
var request = require('request');

const multer = require('multer');

//----------------------------------------


const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
      callback(null, './images');
    },
  
    //add back the extension
    filename: function (request, file, callback) {
      callback(null,  file.originalname);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fieldSize: 1024 * 1024 * 3,
    },
  });




const app = express()
app.use(cors())
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
var urlencodedParser = bodyParser.urlencoded({ extended: true })
//----------------------------------------
const { MongoClient } = require('mongodb');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const { Console, debug } = require('console');
const console = require('console');
const { strictEqual } = require('assert');
var uri = 'mongodb://localhost:27017'
var uri2 = 'mongodb+srv://osama:p4dFB4OCV3hbxHKs@cluster0.txsjl.mongodb.net/workshop?authSource=admin&replicaSet=atlas-vbzzgl-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const client = new MongoClient(uri2)
server.listen(3000,()=>console.log(chalk.green.bold.inverse('Server Online @ 3000 > ')))
//------------------------------------------

//websocket


wss.on('connection',(ws)=>{
    

    console.log("new User Connected ");

    ws.send("Welcom to Server!");
    ws.send("> Connected To Server!,1")
 

 
})


//------------------------------------------

//Authentication

async function Authenticate(name,pwd){
    console.log("Admin LogIn @\t"+name,pwd)
    await client.connect()
    const db =  client.db('workshop');
    const Users = db.collection('clients');
    
    const findResult = await Users.find({email:name,pwd:pwd},{projection:{_id:0}}).toArray();
    if(findResult.length==0){
        Send_To_Debugger("> Admin Log In Error,0");
        return false}else{
            Send_To_Debugger("> Admin Log In Sucess,1");    
            return true}
    
}
async function Authenticate_Client(name,pwd){

    await client.connect()
    const db =  client.db('workshop');
    const Users = db.collection('clients');
    const findResult = await Users.find({email:name,pwd:pwd}).toArray();
   if(findResult.length==0){
    console.log(chalk.bold.red("Client LogIn @\t"+name,pwd))
    Send_To_Debugger("> Client Log In Error,0");  
        return false}
        else{
            console.log(chalk.bold.green("Client LogIn @\t"+name,pwd))
            Send_To_Debugger("> Client Log In Sucess,1"); 
            return findResult}
    
}
async function Authenticate_Staff(name,pwd){

    await client.connect()
    const db =  client.db('workshop');
    const Users = db.collection('staffs');
    const findResult = await Users.find({email:name,pwd:pwd}).toArray();
   if(findResult.length==0){
    console.log(chalk.bold.red("Staff LogIn @\t"+name,pwd))
        return false}
        else{
            console.log(chalk.bold.green("Staff LogIn @\t"+name,pwd))
            return findResult}
    
}
app.get('/admin/:name/:pwd',async function (req,res){

    const result = await Authenticate(req.params.name,req.params.pwd)
    console.log(result)
    
    return res.json( {result:result})
})   
app.get('/client/:name/:pwd',async function (req,res){

    const result = await Authenticate_Client(req.params.name,req.params.pwd)
      
    return res.json( {result:result})
})
app.get('/staff/:name/:pwd',async function (req,res){

    const result = await Authenticate_Staff(req.params.name,req.params.pwd)
      
    return res.json( {result:result})
})

// -----------------------------
//Shop

app.get('/get_inv',async (req,res)=>{

    const list = await shop.Get();
    Send_To_Debugger("> Admin Refresh Inventory,1"); 
    res.send(list);

})
app.get('/find/:name',async(req,res)=>{

    var find_list = await shop.Find(req.params.name);
    Send_To_Debugger("> Client Searched For"+req.params.name+". Results = [ "+find_list.length+"],1"); 
     res.send(find_list);
    

})
app.get('/get_inv/mbl',async (req,res)=>{

    const list = await shop.Get();
    Send_To_Debugger("> Client Refresh Inventory,1"); 
    res.json({list});

})
app.post('/shop_insert',urlencodedParser,upload.single('image') ,(req,res)=>{

  shop.Insert(req.body.NAME,req.body.COST,req.body.QUANTITY,req.file.originalname);
    Send_To_Debugger("> Admin Inserted New Inventory Item,1"); 

})
app.get('/img/:name',(req,res)=>{
    var path = "C:\\Users\\abida\\Desktop\\workshop\\workshop2.0\\Workshop-server\\uploads\\images";
    res.sendFile(req.params.name,{root: `${path}`})
    
    })
app.get('/shop_edit/:id/:name/:cost/:Quantity',(req,res)=>{

    shop.Edit(req.params.id, req.params.name,req.params.cost,req.params.Quantity);
    Send_To_Debugger("> Admin Edit an Inventory Item,1");

})
app.get('/new_order/:client_id/:items_id/:address/:cost',(req,res)=>{

    var ids = req.params.items_id.split(',');
    ids.pop();
    
    shop.New_Order(ids,req.params.client_id,req.params.address,req.params.cost);
    Send_To_Debugger("> Client Initiated an Order,1");
    res.send("Done");

})
app.get('/orders',async (req,res)=>{

    const list = await shop.Get_Orders();
    
    res.send( list);

})
app.get('/orders/:id', async(req,res)=>{

    const list = await shop.Find_Order(req.params.id);    
    Send_To_Debugger("> Client Refresh Orders,1"); 
    res.send(list);

})
app.get('/update_order/:cid/:oid/:state', (req,res)=>{


    oid_ = req.params.oid
    cid_ = req.params.cid
    state_ = req.params.state
    
    shop.Edit_Order_Status(oid_,state_);
    Send_To_Debugger("> Admin Updated Order,1"); 
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(cid_+",OSU");
        }
      });
    


})
// -----------------------------


//Appointment

app.get('/new_appointment/:cid/:date/:Time/:Cat/:Dis',async (req,res)=>{

    const cid = req.params.cid;
    const Date = req.params.date;
    const Time = req.params.Time;
    const Cat = req.params.Cat;
    const Dis = req.params.Dis;
    Send_To_Debugger("> Client Initiated  an Appointment,1");
    await Appointment.Insert(cid,Date,Time,Cat,Dis);
    res.send(true);

});
app.get('/find_appointment/:cid',async(req,res)=>{

    var cid = req.params.cid;

    var list = await Appointment.Get(cid);
    res.send(list);

})
app.get('/cancle_appointment/:id',async (req,res)=>{

    await Appointment.Delete(req.params.id);

})
app.get('/appointments',async(req,res)=>{
    
    var x = await Appointment.Get_All();
    res.send(x);
})
app.get('/Update_Apt/:id/:stat',async(req,res)=>{

await Appointment.Edit(req.params.id,req.params.stat);
res.send(Done);

})


//Remote Mechanic

app.get('/status_update/:ID/:State/:Name',async(req,res)=>{

var x = req.params.ID.toString("");
var y = req.params.State;
var z = req.params.Name;
await RM.Update_Status(x,y);
var a = "UnKnown";
switch(y){
    case "0":a ="Offline"; break;
    case "1":a="Online"; break;
    case "2":a="Busy"; break;
}
Send_To_Debugger("> Staff Member "+z+" is Now "+a+" ,1");
res.send('OK');


})

app.get('/new_apt/:id/:type/:dis',async(req,res)=>{
    console.log("New Reomte Appointment Recived");
    var Remote_Appointm_ID =  await RM.New_Request(req.params.id,req.params.type,req.params.dis);
    var Recommended_Staff_ID =  await RM.Resolve_request(req.params.type);

    console.log(Remote_Appointm_ID._id+" :: "+Recommended_Staff_ID);

    var x = "0001:"+params.id+":"+Recommended_Staff_ID+":"+Remote_Appointm_ID;
    Send_To_All(x);
    
    res.send("New Remote Apt Recived");
})

app.get('/Staff_Check_In/:id/:state',async(req,res)=>{
    
    await RM.Check_In(req.params.id,req.params.state);
})
app.get('/Staff_Location/:id/:x/:y',async(req,res)=>{
    
    await RM.Set_Location(req.params.id,req.params.x,req.params.y);
})
// -----------------------------


//------------------------------
function Send_To_Debugger(x){
    wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(x);
    }
  });}

  function Send_To_All(x){
    wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(x);
    }
  });}