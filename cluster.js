const cluster = require("cluster");
const { cpus } = require("os");
const app = require("./app");
const sequelize = require("./lib/sequelize");

let port = 3000;

const cpuCount = cpus().length;

if (cluster.isPrimary) {
  masterProcess();
} else {
  childProcess();
}

function masterProcess() {
  console.log(`master process running on ${process.pid} `);

  for (let i = 1; i <= 2; i++) {
    // console.log(`Forking process number ${i}...`);
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    // code <number> The exit code, if it exited normally.
    // signal <string> The name of the signal (e.g. 'SIGHUP') that caused the process to be killed.
    if (signal) {
      console.log(
        `worker on ${worker.process.pid} was killed by signal: ${signal}`
      );
    } else if (code !== 0) {
      console.log(
        `worker on ${worker.process.pid} exited with error code: ${code}`
      );
    }
    cluster.fork(); //inorder to maintain the no. of workers
  });
}

function childProcess() {
  app.listen(port, () => {
    console.log(`worker ${process.pid} listening on ${port}`);
  });

  sequelize
    .authenticate()
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err));
}
