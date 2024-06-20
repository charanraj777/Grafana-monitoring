const express= require('express')
const client= require("prom-client")   //metric collection
const {doSomeHeavyTask}= require("./util")

const app = express();
const PORT=process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
    });


app.get("/",(req,res) =>{
    return res.json({message:`Hello from express server`})
});

app.get("/slow", async(req,res) =>{

    try {
       const timetaken= await doSomeHeavyTask();
       console.log('----',timetaken)
       return res.json({
        status:"success",
        message:`Heavy task completed in ${timetaken} ms`,
       })
        
    } catch (error) {
        return res
        .status(500)
        .json({status:"Error",message:"internal server error"})
    }
   
    
});
app.listen(PORT,()=> console.log(`express server started on http://localhost:${PORT}`))