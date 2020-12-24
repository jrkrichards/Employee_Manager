// This file is to ask the user questions on how they would like to update the eeDb.

// Variables 
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const startChoices = ["View", "Add", "Update"]
const tables = ["department", "role", "employees"]
// const otherUtils = require('./utils/generateMarkdown')

// array of questions for user
const questions = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: startChoices,
        },
        {
            type: 'list',
            name: 'table', 
            message: 'Which table?',
            choices: tables,
        },
    ]);
};

// function to write README file
const writeFileAsync = util.promisify(fs.writeFile);

// function to initialize program
const init = async () => {
    console.log('Starting input questions');
    try {
      const answers = await questions();
        
      console.log(answers)
    //   const markdownAnswers = otherUtils(answers);
  
    //   await writeFileAsync('README.md', markdownAnswers);
  
      console.log('Success');
    } catch (err) {
      console.log(err);
    }
  };

// function call to initialize program
init();
