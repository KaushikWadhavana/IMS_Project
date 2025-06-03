const { MongoClient } = require('mongodb');
const lib = require("express")
const cors = require("cors");

const server = lib()
server.use(cors());

//route or API one is post and another is get
server.post("/users", (req, res) => {
  console.log("request received")
  res.send("user created")
})
server.get("/users", (req, res) => {
  const connection = new MongoClient("mongodb://kaushik:kaushik123@localhost:27017/IMS")
  connection.connect().
  then(()=>connection.db()).
  then((db)=>db.collection('users')).
  then((collection)=>collection.find().toArray()).
  then((result)=>console.log(result)).
  // then((result)=>res.json(result)). for peint in html page
  catch((err)=>console.log(err))
})
server.post("/player", (req, res) => {
  console.log("request received")
  res.send("Player is Created")
})
server.post("/Team", (req, res) => {
  console.log("request received")
  res.send("Team is Created.")
})

server.listen(8000, () => {
  console.log("server is ready and listening order port 8000")


})