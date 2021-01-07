const { write } = require("fs");
const { readJSON, writeJSON, writeJson } = require("fs-extra");
const { join } = require("path");

const examsPath = join(__dirname, "./exams/exams.json");
const questionsPath = join(__dirname, "./questions/questions.json");

const readDB = async filePath => {
  try {
    const fileJson = await readJSON(filePath);
    return fileJson;
  } catch (error) {
    throw new Error(error);
  }
};

const writeDB = async (filePath, fileContent) => {
  try {
    await writeJson(filePath, fileContent);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getExams: async () => readDB(examsPath),
  writeExams: async examsData => writeDB(examsPath, examsData),
  getQuestions: async () => readDB(questionsPath),
};
