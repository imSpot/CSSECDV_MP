DROP DATABASE IF EXISTS movies;
CREATE DATABASE movies;
USE movies;

CREATE TABLE movies (
    id              INT AUTO_INCREMENT PRIMARY KEY
    ,title           VARCHAR(255) NOT NULL
    ,poster          VARCHAR(255)
    ,runtime         INT
    ,descriptions    TEXT
    ,year            INT
    ,directors       TEXT
    ,casts           TEXT
    ,category        VARCHAR(255)
);
INSERT INTO movies (title, poster, runtime, descriptions, year, directors, casts, category)
VALUES 
('The Godfather', NULL, 175, 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 'Francis Coppola', 'Marlon Brando, Al Pacino, James Caan', 'Crime, Drama');
INSERT INTO movies (title, poster, runtime, descriptions, year, directors, casts, category)
VALUES 
('The Dark Knight', NULL, 152, 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.', 2008, 'Christopher Nolan', 'Christian Bale, Heath Ledger, Aaron Eckhart', 'Action, Crime, Drama');
INSERT INTO movies (title, poster, runtime, descriptions, year, directors, casts, category)
VALUES 
('The Shawshank Redemption', NULL, 142, 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 'Frank Darabont', 'Tim Robbins, Morgan Freeman, Bob Gunton', 'Drama');
INSERT INTO movies (title, poster, runtime, descriptions, year, directors, casts, category)
VALUES 
('Notting Hill', NULL, 124, 'The life of a simple bookshop owner changes when he meets the most famous film star in the world.', 1999, 'Roger Michell', 'Hugh Grant, Julia Roberts, Richard McCabe', 'Romance, Comedy, Drama');
INSERT INTO movies (title, poster, runtime, descriptions, year, directors, casts, category)
VALUES 
('The Pursuit of Happyness', NULL, 117, 'A struggling salesman takes custody of his son as he is poised to begin a life-changing professional career.', 2006, 'Gabriele Muccino', 'Will Smith, Jaden Smith, Thandie Newton', 'Biography, Drama');