const express = require('express'),
  path = require('path')
  xss = require('xss'),
  todoService = require('./todo-service'),
  todoRouter = express.Router(),
  jsonParser = express.json();

const serializeToDo = todo => ({
  id: todo.id,
  title: xss(todo.title),
  description: xss(todo.description)
});

//home page route
todoRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    todoService.getAllToDos(knexInstance)
      .then(todos => {
        res.json(todos.map(serializeToDo));
      })
      .catch(next);
  }) 
  .post(jsonParser, (req, res, next) => {
    const { title, description } = req.body,
      newToDo = { title, description };

    for (const [key, value] of Object.entries(newToDo)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }
 
    todoService.insertToDo(req.app.get('db'), newToDo)
      .then(todo => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${todo.id}`))
          .json(serializeToDo(todo));
      })
      .catch(next);
  });

// individual to do items
todoRouter
  .route('/:todoid')
  .all((req, res, next) => {
    todoService.getById(req.app.get('db'), req.params.todoid)
      .then(todo => {
        if (!todo) {
          return res.status(404).json({
            error: { message: 'No matching to do' }
          });
        }
        res.todo = todo;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeToDo(res.todo));
  })
  // delete selected to do
  .delete((req, res, next) => {
    todoService.deleteToDo(req.app.get('db'), req.params.todoid)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  // edit selected to do
  .patch(jsonParser, (req, res, next) => {
    const { title, description } = req.body,
      todoToEdit = { title, description };

    const numberOfValues = Object.values(todoToEdit).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: { message: 'Body must contain title/description.' }
      });

    todoService.editToDo(
      req.app.get('db'),
      req.params.todoid,
      todoToEdit
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = todoRouter