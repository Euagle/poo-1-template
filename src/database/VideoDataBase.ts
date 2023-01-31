import { TVideoDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class VideosDataBase extends BaseDatabase {
  public static TABLE_VIDEOS = "videos";
  public async findVideos(q: string | undefined) {
    let videosDB;

    if (q) {
      const result: TVideoDB[] = await BaseDatabase.connection(
        VideosDataBase.TABLE_VIDEOS
      ).where("name", "LIKE", `%${q}%`);
      videosDB = result;
    } else {
      const result: TVideoDB[] = await BaseDatabase.connection(
        VideosDataBase.TABLE_VIDEOS
      );
      videosDB = result;
    }
    return videosDB;
  }
  public async insertVideo(newVideoo: TVideoDB) {
    await BaseDatabase.connection(VideosDataBase.TABLE_VIDEOS).insert(
      newVideoo
    );
  }
  public async editeVideo(newVideoDB: TVideoDB, id: string) {
    await BaseDatabase.connection(VideosDataBase.TABLE_VIDEOS)
      .update(newVideoDB)
      .where({ id });
  }

  public async deletVideo(id: string) {
    await BaseDatabase.connection(VideosDataBase.TABLE_VIDEOS)
      .del()
      .where({ id });
  }
  public async findVideosById(id: string) {
    const [videoDB]: TVideoDB[] | undefined[] = await BaseDatabase.connection(
      VideosDataBase.TABLE_VIDEOS
    ).where({ id });
    console.table(videoDB);
    return videoDB;
  }
}
