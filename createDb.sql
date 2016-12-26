DROP DATABASE IF EXISTS "ng-cms";
CREATE DATABASE "ng-cms"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

\c ng-cms;

/*
** Roles table
*/
CREATE TABLE roles (
    ID SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE
);

INSERT INTO roles (name) VALUES('Administrator');
INSERT INTO roles (name) VALUES('User');

/*
** Users table
*/
CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    name VARCHAR,
    surname VARCHAR,
    email VARCHAR UNIQUE,
    birthday DATE,
    password VARCHAR,
    gender VARCHAR,
    role_id INTEGER REFERENCES roles (ID)
);

/*
** Role Activity table
*/
CREATE TABLE role_activities (
    ID SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE,
    role_id INTEGER REFERENCES roles (ID)   
);