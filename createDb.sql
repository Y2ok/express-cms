DROP DATABASE IF EXISTS "ng-cms";
CREATE DATABASE "ng-cms"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

\c ng-cms;

CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    name VARCHAR,
    surname VARCHAR,
    email VARCHAR,
    age INTEGER,
    password VARCHAR,
    sex VARCHAR
);