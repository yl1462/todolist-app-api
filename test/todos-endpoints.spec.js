const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

const {
  makeTodosArray,
  makeMaliciousTodo
  //dateParse //If date parsing necessary
} = require('./todo.fixtures');

describe('Todos Endpoints', function() {
  let db;
  before('make knex instance to simulate server', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL //remember to migrate the test database
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean tables before each test', () => {
    return db.raw('TRUNCATE todos RESTART IDENTITY CASCADE');
  });

  afterEach('clean tables after each test', () => {
    return db.raw('TRUNCATE todos RESTART IDENTITY CASCADE');
  });

  //test home page
  describe('GET /api/todo', () => {
    context('todo table has no contents', () => {
      it('Responds with a 200 status and an empty array', () => {
        return supertest(app)
          .get('/api/todo')
          .expect(200, []);
      });
    });

    context('todo table has some todo', () => {
      const testTodos = makeTodosArray();

      beforeEach('populate table with todo', () => {
        return db.into('todos').insert(testTodos);
      });

      afterEach('clean todos table', () => {
        return db.raw(
          'TRUNCATE todos RESTART IDENTITY CASCADE'
        );
      });

      //test if table could receive all testing data
      it('responds with an array containing all test todo', () => {
        return supertest(app)
          .get('/api/todo')
          .expect(200, testTodos);
      });

      context('given an XSS attack todo in name', () => {
        const { maliciousTodo, expectedTodo } = makeMaliciousTodo();
        beforeEach('insert malicious todo', () => {
          return db.into('todos').insert([maliciousTodo]);
        });
        afterEach('clean todo table', () => {
          return db.raw(
            'TRUNCATE todos RESTART IDENTITY CASCADE'
          );
        });

        it('removes XSS attack content (<script> to &lt;script&gt)', () => {
          let expectedTodos = testTodos;
          expectedTodos.splice(3, 1, expectedTodo);
          return supertest(app)
            .get('/api/todo')
            .expect(200)
            .expect(res => {
              expect(res.body[3].name).to.eql(expectedTodo.name);
            });
        });
      });
    });
  });

  //test selected to do
  describe('GET /api/todo/id', () => {
    context(
      'given todo table has no contents or no todo ids match given id',
      () => {
        it('Responds with a 404', () => {
          const id = 1000;
          return supertest(app)
            .get(`/api/todo/${id}`)
            .expect(404, { error: { message: 'No matching to do' } });
        });
      }
    );

    context('todo table has some todo', () => {
      const testTodos = makeTodosArray();

      beforeEach('populate table with todo', () => {
        return db.into('todos').insert(testTodos);
      });

      afterEach('clean todo table', () => {
        return db.raw(
          'TRUNCATE todos RESTART IDENTITY CASCADE'
        );
      });

      it('given valid id, responds with a todo with matching id.', () => {
        const expectedId = testTodos[1].id,
          expectedTodo = testTodos[1];

        return supertest(app)
          .get(`/api/todo/${expectedId}`)
          .expect(res => {
            expect(res.body.name).to.eql(expectedTodo.name);
          });
      });
    });

    context('given an XSS attack todo in name (<script>)', () => {
      const { maliciousTodo, expectedTodo } = makeMaliciousTodo();
      beforeEach('insert malicious todo', () => {
        return db.into('todos').insert([maliciousTodo]);
      });

      afterEach('clean todo table', () => {
        return db.raw(
          'TRUNCATE todos RESTART IDENTITY CASCADE'
        );
      });

      it('removes XSS attack in name (<script> becomes &lt;script&gt)', () => {
        return supertest(app)
          .get(`/api/todo/${maliciousTodo.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedTodo.name);
          });
      });
    });
  });
});