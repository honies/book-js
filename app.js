const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const users = require('./users');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

const options = {
  swaggerDefinition: {
    info: {
      title: 'My Book API',
      version: '1.0.0'
    }
  },
  apis: ['./swagger.js'] // путь к файлам с маршрутами
};

const swaggerSpec = swaggerJSDoc(options);

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// GET запрос для получения всех пользователей
app.get('/books', (req, res) => {
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
      return;
    }
    const books = JSON.parse(data);
    res.json(books);
  });
});

// GET запрос для получения пользователя по ID
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
      return;
    }
    const books = JSON.parse(data);
    const book = books.find(b => b.id === bookId);
    if (!book) {
      res.status(404).send('Информация о книге не найдена');
      return;
    }
    res.json(book);
  });
});

// POST запрос для создания нового пользователя
app.post('/books', (req, res) => {
  const { id, name, email } = req.body;
  const post = {
    id,
    name,
    email
  };
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
      return;
    }
    const books = JSON.parse(data);
    books.push(post);
    fs.writeFile('books.json', JSON.stringify(books), err => {
      if (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
        return;
      }
      res.send('Новая книга успешно создана');
    });
  });
});

// PUT запрос для обновления информации о пользователе
app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const updatedBook = req.body;
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
      return;
    }
    const books = JSON.parse(data);
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
      res.status(404).send('Информация о книге не найдена');
      return;
    }
    books[bookIndex] = updatedBook;
    fs.writeFile('books.json', JSON.stringify(books), err => {
      if (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
        return;
      }
      res.send('Информация о книге успешно обновлена');
    });
  });
});

// DELETE запрос для удаления пользователя
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
      return;
    }
    const books = JSON.parse(data);
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
      res.status(404).send('Информация о книге не найдена');
      return;
    }
    books.splice(bookIndex, 1);
    fs.writeFile('books.json', JSON.stringify(books), err => {
      if (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
        return;
      }
      res.send('Информация о книге успешно удалена');
    });
  });
});


app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});