const express = require("express");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");
const { getQuestions, writeQuestions } = require("../fsUtilities");

const questionRouter = express.Router();

questionRouter.post("/giveIDs", async (req, res) => {
  try {
    const questionDB = await getQuestions();
    questionDB.forEach(question => (question._id = uniqid()));
    await writeQuestions(questionDB);
  } catch (error) {
    console.log(error);
  }
});

questionRouter.delete("/:questionID", async (req, res) => {
  try {
    //Getting database of questions
    const questionDB = await getQuestions();

    const newDB = questionDB.filter(
      question => question._id !== req.params.questionID
    );
    //Overwrite DB
    await writeQuestions(newDB);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

questionRouter.post(
  "/",
  [
    check("duration")
      .exists()
      .isInt()
      .withMessage("Give a duration for the question"),
    check("text")
      .exists()
      .isLength({ min: 3 })
      .withMessage("Give the actual question"),
    check("answers")
      .exists()
      .isArray({ min: 4, max: 4 })
      .withMessage("Provide at least four answers"),
    check("answers.*.isCorrect")
      .exists()
      .isBoolean()
      .withMessage("You must show if answers are true or false with a boolean"),
    check("answers.*.text").exists().withMessage("Give text of answer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.send(errors);
    } else {
      try {
        //GET QUESTION DATABASE
        const questionDB = await readQuestions();
        //FIND INDEX OF CHOSEN QUESTION
        const selectedIndex = questionDB.findIndex(
          question => question._id === req.params.questionID
        );
        //IF/ELSE
        if (selectedIndex !== -1) {
          questionDB[selectedIndex] = {
            ...questionDB[selectedIndex],
            ...req.body,
          };
          await writeQuestions(questionDB);
          res.send("Edited!");
        } else {
          console.log("No question exists with that ID");
          res.status(404).send("No question exists with that ID");
        }
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    }
  }
);

module.exports = questionRouter;
