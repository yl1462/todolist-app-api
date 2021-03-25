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
  .delete((req, res, next) => {
    todoService.deleteToDo(req.app.get('db'), req.params.todoid)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
//   .patch(jsonParser, (req, res, next) => {
//     const { name } = req.body,
//       folderToUpdate = { name };

//     const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
//     if (numberOfValues === 0)
//       return res.status(400).json({
//         error: { message: 'Body must contain name.' }
//       });

//     FoldersService.updateFolder(
//       req.app.get('db'),
//       req.params.folder_id,
//       folderToUpdate
//     )
//       .then(numRowsAffected => {
//         res.status(204).end();
//       })
//       .catch(next);
//   });

// module.exports = foldersRouter;
// // const path = require('path'),
// //   express = require('express'),
// //   xss = require('xss'),
// //   { v4: uuidv4 } = require('uuid'),
// //   FoldersService = require('./folders-service'),
// //   foldersRouter = express.Router(),
// //   jsonParser = express.json();

// // const serializeFolder = folder => ({
// //   id: folder.id,
// //   name: xss(folder.name)
// // });

// // foldersRouter
// //   .route('/')
// //   .get((req, res, next) => {
// //     const knexInstance = req.app.get('db');
// //     FoldersService.getAllFolders(knexInstance)
// //       .then(folders => {
// //         res.json(folders.map(serializeFolder));
// //       })
// //       .catch(next);
// //   })
// //   .post(jsonParser, (req, res, next) => {
// //     const { name } = req.body,
// //       newFolder = { name };

// //     for (const [key, value] of Object.entries(newFolder)) {
// //       if (value == null) {
// //         return res.status(400).json({
// //           error: { message: `Missing ${key} in request body` }
// //         });
// //       }
// //     }
    
//     newFolder.name = xss(newFolder.name);

//     FoldersService.insertFolder(req.app.get('db'), newFolder)
//       .then(folder => {
//         res
//           .status(201)
//           .location(path.posix.join(req.originalUrl, `/${folder.id}`))
//           .json(serializeFolder(folder));
//       })
//       .catch(next);
//   });

// foldersRouter
//   .route('/:folder_id')
//   .all((req, res, next) => {
//     FoldersService.getById(req.app.get('db'), req.params.folder_id)
//       .then(folder => {
//         if (!folder) {
//           return res.status(404).json({
//             error: { message: 'No matching folder' }
//           });
//         }
//         res.folder = folder;
//         next();
//       })
//       .catch(next);
//   })
//   .get((req, res, next) => {
//     res.json(serializeFolder(res.folder));
//   })
//   .delete((req, res, next) => {
//     FoldersService.deleteFolder(req.app.get('db'), req.params.folder_id)
//       .then(numRowsAffected => {
//         res.status(204).end();
//       })
//       .catch(next);
//   })
//   .patch(jsonParser, (req, res, next) => {
//     const { name } = req.body,
//       folderToUpdate = { name };

//     const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
//     if (numberOfValues === 0)
//       return res.status(400).json({
//         error: { message: 'Body must contain name.' }
//       });

//     FoldersService.updateFolder(
//       req.app.get('db'),
//       req.params.folder_id,
//       folderToUpdate
//     )
//       .then(numRowsAffected => {
//         res.status(204).end();
//       })
//       .catch(next);
//   });

// module.exports = foldersRouter;

module.exports = todoRouter