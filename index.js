const express = require("express");
const app = express();
const router = express.Router();
const { Sequelize, DataTypes } = require("sequelize");
const bodyParser = require("body-parser");
const cors = require("cors");

(async function () {
  // DB configuration
  const sequelize = new Sequelize("to-do-list", "user", "pass", {
    dialect: "sqlite",
    host: "./dev.sqlite",
  });

  // Defining Schema and Model
  const task = {
    taskDetail: DataTypes.TEXT,
    isCompleted: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
  };

  const taskModel = sequelize.define("to_do_list", task);

  await sequelize.authenticate();
  await sequelize.sync({
    logging: true,
  });
  console.log("connected to db");

  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(bodyParser.json({ limit: "100mb" }));
  // Routes------------------------------------------------------------------

  router.get("/", async (req, res) => {
    return res.status(200).json({
      message: "App running....."
    })
  })

  router.get("/getTasks", async (req, res) => {
    const tasks = await taskModel.findAll({
      where: { isDeleted: false },
    });
    return res.status(200).json({
      tasks: tasks,
    });
  });

  router.post("/insertTask", async (req, res) => {
    if (!req.body.task) {
      return res.status(400).json({
        message: "No task details available",
      });
    }
    const response = await taskModel.create(req.body.task);
    return res.status(200).json({
      data: response,
      message: "Data inserted",
    });
  });

  router.put("/updateTask/:taskId", async (req, res) => {
    if (!req.params.taskId) {
      return res.status(400).json({
        message: "No task details available",
      });
    }
    const criteria = { id: req.params.taskId };
    const response = await taskModel.update(req.body, { where: criteria });
    return res.status(200).json({
      data: response,
      message: "Data updated",
    });
  });

  router.put("/bulkDeleteTasks", async (req, res) => {
    const payload = {
      isDeleted: true,
    };
    const criteria = {
      isCompleted: true,
    };
    const response = await taskModel.update(payload, { where: criteria });
    return res.status(200).json({
      data: response,
      message: "Data updated",
    });
  });
  // To run locally uncomment this
  app.use('/api/v1', router)
})();

app.listen(2000, () => console.log("app running in port 2000"));