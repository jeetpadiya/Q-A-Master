import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsFilePath = path.join(__dirname, 'questions.json');

app.use(express.json());
app.use(cors());


app.get('/api/questions',(req,res)=>{
    fs.readFile(questionsFilePath,'utf-8',(err,data)=>{
        if(err){
            return res.status(500).send({message:"Failed to load questions"})
        }
        const questions = JSON.parse(data)
        res.status(200).json({success:true,questions})
    })
})

app.listen(PORT,()=>{
    console.log(`Server is Running ${PORT}`);
})
