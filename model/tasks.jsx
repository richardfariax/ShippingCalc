import { db } from "./database";

const setupTasksTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          openedDate TEXT,
          createdBy TEXT,
          deadline TEXT,
          status TEXT,
          description TEXT
        );`
    );
  });
};

const addFreight = (
  origin,
  destination,
  value,
  cargoType,
  openedDate,
  createdBy
) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO freights (origin, destination, value, cargoType, openedDate, createdBy) VALUES (?, ?, ?, ?, ?, ?)",
        [
          JSON.stringify(origin),
          JSON.stringify(destination),
          value,
          cargoType,
          openedDate,
          createdBy,
        ],
        (_, result) => {
          resolve(result.insertId);
        }
      );
    });
  });
};

const getAllTasks = (createdBy = null) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      let query = "SELECT * FROM tasks";
      let params = [];

      if (createdBy) {
        query += " WHERE createdBy = ?";
        params.push(createdBy);
      }

      tx.executeSql(query, params, (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
};

const updateTask = (updatedTask) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE tasks SET title = ?, openedDate = ?, createdBy = ?, deadline = ?, status = ?, description = ? WHERE id = ?",
        [
          updatedTask.title,
          updatedTask.openedDate,
          updatedTask.createdBy,
          updatedTask.deadline,
          updatedTask.status,
          updatedTask.description,
          updatedTask.id,
        ],
        (_, result) => {
          resolve(result.rowsAffected);
        }
      );
    });
  });
};

const deleteTask = (taskId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM tasks WHERE id = ?", [taskId], (_, result) => {
        resolve(result.rowsAffected);
      });
    });
  });
};

export { setupTasksTable, addFreight, getAllTasks, updateTask, deleteTask };
