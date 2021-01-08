const express = require("express");
const uniqid = require("uniqid");
const path = require("path");
const { join } = require("path");
const { getExams, writeExams, getQuestions } = require("../fsUtilities");

const examsJsonPath = path.join(__dirname, "exams.json");
const examsRouter = express.Router();

examsRouter.get("/", async (req, res, next) => {
  const allExams = await getExams(examsJsonPath);
  res.send(allExams);
});

examsRouter.get("/:exid", async (req, res, next) => {
  const allExams = await getExams(examsJsonPath);

  console.log("GET ID");
  const exam = allExams.find(exam => exam.id === req.params.exid);

  console.log(exam);
  res.send(exam);
});

examsRouter.post("/start", async (req, res) => {
  try {
    //get databases of exams and questions
    const examsDB = await getExams();
    const questionsDB = await getQuestions();

    //empty array for random questions
    const questionsArray = [];

    //Exam duration variable
    let examDuration = 0;

    //randomize questions
    try {
      const selectedQuestions = [];

      for (let i = 0; i < 5; i++) {
        let questionIndex = Math.floor(Math.random() * questionsDB.length);
        if (selectedQuestions.includes(questionIndex)) {
          i--;
        } else {
          selectedQuestions.push(questionIndex);
        }
      }

      //Get questions from random indexes above
      selectedQuestions.forEach(index => {
        questionsArray.push(questionsDB[index]);

        examDuration += questionsDB[index].duration;
      });
    } catch (error) {
      console.log(error);
    }

    //Push exam object to database
    examsDB.push({
      ...req.body,
      id: uniqid(),
      Date: new Date(),
      isCompleted: false,
      totalDuration: 30,
      questions: questionsArray,
    });

    await writeExams(examsDB);
    res.send("added!");
  } catch (error) {
    console.log(error);
  }
});

examsRouter.post("/:id/answer", async (req, res) => {
  try {
    //Get exam database
    const examsDB = await getExams();

    //get exam from the req.params
    const selectedExamIndex = examsDB.findIndex(
      exam => exam.id === req.params.id
    );

    if (selectedExamIndex !== -1) {
      examsDB[selectedExamIndex].questions[req.body.question].providedAnswer =
        req.body.answer;
      await writeExams(examsDB);
      res.send(examsDB);
    } else {
      res.send("Exam not found!");
    }
  } catch (error) {
    console.log(error);
  }
});

examsRouter.get("/:id", async (req, res) => {
  try {
    //Get exam database
    const examsDB = await getExams();
    const selectedExam = examsDB.find(exam => exam.id === req.params.id);

    //calculate score
    let score = 0;
    selectedExam.questions.forEach(question => {
      if (question.answer[question.providedAnswer].isCorrect === true) {
        score += 1;
      }
    });
    selectedExam.score = score;
    selectedExam.isCompleted = true;
    res.send(selectedExam);
  } catch (error) {
    console.log(error);
  }
});

module.exports = examsRouter;
