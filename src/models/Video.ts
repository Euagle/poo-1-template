

export class Video{
constructor (
    private id: string,
    private title: string,
    private duration: string,
    private upload_at: string
){}

public getId() {
    return this.id
}

public setId(value:string): void {
    this.id = value
    
}

public getTitle() {
    return this.title
}
public setTitle(value:string): void {
    this.title = value
    
}

public getDuration() {
    return this.duration
}
public setDuration(value:string): void {
    this.duration = value
    
}



public getCreatedAt() {
    return this.upload_at
}
public setCreatedAt(value:string): void {
    this.upload_at = value
    
}

}

// criando um video
const video = new Video(
    "u004",
    "Aula de poo",
    "60min",
    "2023-01-30 22:22:00"

)
console.table(video)