-- Active: 1675128331797@@127.0.0.1@3306

CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration TEXT UNIQUE NOT NULL,
    upload_at TEXT DEFAULT (DATETIME()) NOT NULL
);
DROP TABLE videos;

INSERT INTO videos (id, title, duration)
VALUES
	("u001", "I am woman", "3 minutos"),
	("u002", "I not girl, not yet woman", "5 minutos");


SELECT * FROM videos;

