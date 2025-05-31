const lib = require("express")

const server = lib()

//route or API one is post and another is get
server.post("/users", (req,res)=>{
    console.log("request received")
    res.send("user created")
})
server.post("/player", (req,res)=>{
    console.log("request received")
    res.send("Player is Created")
})
server.post("/Team", (req,res)=>{
    console.log("request received")
    res.send("Team is Created.")
})

server.listen(8000, ()=>{
    console.log("server is ready and listening order port 8000")
    

})