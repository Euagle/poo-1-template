import express, { Request, Response } from 'express'
import cors from 'cors'
import { TVideoDB } from './types'
import { Video } from './models/Video';
import { VideosDataBase } from './database/VideoDataBase';

// import { db } from './database/BaseDatabase'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

//teste
app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//código refatorado com o uso do poo
//pesquisa todos os videos
app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string | undefined

       
        const videosDatabase = new VideosDataBase()
        const videosDB =await videosDatabase.findVideos(q)

        res.status(200).send(videosDB)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//cria novo video

app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body

        const newVideo = new Video(
            id,
            title,
            duration,
            new Date().toISOString()
        )
        const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_at: newVideo.getCreatedAt()
        }

       

        const videosDatabase = new VideosDataBase() 
        await videosDatabase.insertVideo(newVideoDB) 



    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//edita video pelo id
app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const { newId, newTitle, newDuration } = req.body

        const videoDatabase = new VideosDataBase()
        const videoDB = await videoDatabase.findVideosById(id)
        console.log({videoDB})
        if (!videoDB) {
            res.status(400)
            throw new Error("'id' não encontrada")
        }
         
          const newVideo = new Video(
            newId || videoDB.id,
            newTitle,
            newDuration,
            videoDB.upload_at     
          )
            const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_at: newVideo.getCreatedAt()
        }
        console.log(newVideoDB)
        
        await videoDatabase.editeVideo(newVideoDB, id)
        console.log({newVideoDB})
        res.status(201).send(newVideo)
        
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//Deleta video pelo id
app.delete("/videos/:id", async (req:Request, res:Response)=>{
try{    
    const id = req.params.id

    const videoDatabase = new VideosDataBase()
    const videoDB = await videoDatabase.findVideosById(id)


    if(videoDB){
        await videoDatabase.deletVideo(id)
    }else{
        res.status(400)
        throw new Error("Id não encontrada")
    } 
}catch (error) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error)
    }
})