import express, { Request, Response } from 'express'
import cors from 'cors'
import { TVideoDB } from './types'
import { Video } from './models/Video';

import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

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

app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q

        let videosDB

        if (q) {
            const result: TVideoDB[] = await db("videos").where("name", "LIKE", `%${q}%`)
            videosDB = result
        } else {
            const result: TVideoDB[] = await db("videos")
            videosDB = result
        }

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
        await db("videos").insert(newVideoDB)
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
app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const { newId, newTitle, newDuration } = req.body

        const [video] = await db("videos").where({ id: idToEdit })

        const newVideo = new Video(
            newId,
            newTitle,
            newDuration,
            new Date().toISOString()
        )

        const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_at: newVideo.getCreatedAt()
        }

        if (video) {
            const updateVideo = {
                id: newVideoDB.id || video.id,
                title: newVideoDB.title || video.title,
                duration: newVideoDB.duration || video.duration,
            }
            await db("videos")
                .update(updateVideo)
                .where({ id: idToEdit })
        } else {
            res.status(404)
            throw new Error("Id inválida")
        }
        res.status(201).send(newVideoDB)
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

app.delete("/videos/:id", async (req:Request, res:Response)=>{
try{    
    const idToDelete = req.params.id
    const [verificaVideo] = await db("videos").where({id: idToDelete})

    if(verificaVideo){
        await db("videos").del().where({id: idToDelete})
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