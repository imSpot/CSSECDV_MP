// For testing purposes only
const mysql = require('mysql2')
const dotenv = require(`dotenv`)

dotenv.config()

const database = require('../../src/database.js')
database.getRows('users').then(res => console.log(res))
//database.createUser('69', 'bruh', 'moment', 'bruh@gasddgasd.xyz', 'lolz', 0, 'PERSONAL', 'PHP', null, '2022-09-14 12:08:59','2022-09-14 12:09:24', null).then(response => console.log(response));
//database.dropRow('users', '69').then(res => console.log(res))