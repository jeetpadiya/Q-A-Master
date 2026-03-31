import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';

const questionsFileUrl = new URL('./questions.json', import.meta.url);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/api/users',userRouter)


app.get('/api/questions',(req,res)=>{
    fs.readFile(questionsFileUrl,'utf-8',(err,data)=>{
        if(err){
            return res.status(500).send({message:"Failed to load questions"})
        }
        const questions = JSON.parse(data)
        res.status(200).json({success:true,questions})
    })
})



const startServer = async () => {
    await connectDB();

    app.listen(PORT,()=>{
        console.log(`Server is Running ${PORT}`);
    });
};

startServer();
