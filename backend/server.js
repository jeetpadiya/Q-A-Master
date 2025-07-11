import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT=3000

app.use(express.json());
app.use(cors());


app.get('/api/questions',(req,res)=>{
    fs.readFile("./questions.json",'utf-8',(err,data)=>{
        if(err){
            return res.status(500).send({message:"Failed to load questions"})
        }
        const questions = JSON.parse(data)
        res.status(200).json({success:true,questions})
    })
})

// app.listen(PORT,()=>{
//     console.log(`Server is Running ${PORT}`);
// })