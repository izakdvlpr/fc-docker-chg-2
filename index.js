import express from 'express';
import { createConnection } from 'mysql2/promise';

const app = express()

async function createDatabaseConnection() {
  const connection = await createConnection({
    host: 'mysql',
    user: 'root',
    password: 'docker',
    database: 'docker'
  });
  
  return connection
}

async function createPeople(name) {
  const connection = await createDatabaseConnection()
  
  await connection.query('INSERT INTO people (name) VALUES (?)', [name])
  
  await connection.end()
}

async function getAllPeople() {
  const connection = await createDatabaseConnection()
  
  const [rows] = await connection.query('SELECT name FROM people')
  
  await connection.end()
  
  return rows
}

app.get('/', async (_, res) => {
  await createPeople('Izak')
  
  const people = await getAllPeople()
  
  res.send(`
    <h1>Full Cycle Rocks!</h1>
    <ul>
      ${people.map(person => `<li>${person.name}</li>`).join('')}
    </ul>
  `)
});

app.listen(3333, () => console.log('Server started on 3333'));