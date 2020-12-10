const chalk = require("chalk");
const prompt = require("prompt-sync")();

//This is for storing data in a json file
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);
db.defaults({ todos: [] }).write();
//-----------------------------------------

const args = process.argv;
const commands = ["new", "get", "complete", "help"];

const showInstructions = () => {
  const usageText = `
    todo helps you manage you todo tasks.
  
    usage:
      todo <command>
  
      commands can be:
  
      new:      used to create a new todo
      get:      used to retrieve your todos
      complete: used to mark a todo as complete
      help:     used to print the usage guide
    `;

  console.log(usageText);
};

const logError = (error) => {
  console.log(chalk.red(error));
};

const newTodo = () => {
  const q = chalk.blue("Type your todo: ");
  const todo = prompt(q);

  db.get("todos")
    .push({
      title: todo,
      completed: false,
    })
    .write();

  console.log(chalk.green("Todo saved..."));
};

const getTodos = () => {
  const todos = db.get("todos").value();
  todos.forEach((todo, index) => {
    console.log(`${index + 1}. ${todo.title} `);
  });
};

const completeTodo = () => {
  if (args.length != 4) {
    logError("Invalid number of arguments passed for complete command");
    return;
  }

  let n = Number(args[3]);
  if (isNaN(n)) {
    logError("Please provide a valid number for complete command");
    return;
  }

  let todosLength = db.get("todos").value().length;
  if (n > todosLength) {
    errorLog("Invalid number passed for complete command.");
    return;
  }

  db.set(`todos[${n - 1}].complete`, true).write();

  console.log(chalk.green("Todo marked as completed..."));
};

const main = () => {
  if (args.length > 3 && args[2] != "complete") {
    logError("Only one command is allowed");
    showInstructions();
  }

  switch (args[2]) {
    case "help":
      showInstructions();
      break;
    case "new":
      newTodo();
      break;
    case "get":
      getTodos();
      break;
    case "complete":
      completeTodo();
      break;
    default:
      logError("Invalid command passed");
      showInstructions();
  }
};

module.exports = main();
