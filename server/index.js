const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const PORT = 4000;

server.use(middlewares);

// Custom route for tasks with pagination support
server.get('/tasks', (req, res) => {
  const { page, pagesize } = req.query;
  const _pageSize = parseInt(pagesize, 10) || 10;
  const _page = parseInt(page, 10) || 1;
  const startIdx = (_page - 1) * _pageSize;
  const endIdx = _page * _pageSize;

  const tasks = router.db.get('tasks').value();
  const paginatedTasks = tasks.slice(startIdx, endIdx);

  res.json(paginatedTasks);
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});