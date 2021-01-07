const express = require("express");
const cors = require("cors");

const examsRouter = require("./exams");
const questionRouter = require("./questions");
const listEndpoints = require("express-list-endpoints");
const port = process.env.PORT || 5001;

const server = express();

server.use(cors());
server.use(express.json());

server.use("/exams", examsRouter);
server.use("/question", questionRouter);

console.log(listEndpoints(server));
server.listen(port, () =>
  console.log(`server running on port: http://localhost:${port}`)
);
