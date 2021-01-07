const express = require("express");
const examsRouter = require("./exams");

const port = process.env.PORT || 5001;

const server = express();

server.use(express.json());
server.use("/exams", examsRouter);

server.listen(port, () =>
  console.log(`server running on port: http://localhost:${port}`)
);
