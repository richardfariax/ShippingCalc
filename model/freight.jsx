import { db } from "./database";

const setupFreightsTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS freights (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          origin TEXT,
          destination TEXT,
          value TEXT,
          cargoType TEXT,
          openedDate TEXT,
          createdBy TEXT
        );`
    );
  });
};

const getAllFreights = (createdBy = null) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      let query = "SELECT * FROM freights";
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
        (_, result) => resolve(result.insertId)
      );
    });
  });
};

const updateFreight = (updatedFreight) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE freights SET value = ?, cargoType = ?, openedDate = ?, createdBy = ? WHERE id = ?",
        [
          updatedFreight.value,
          updatedFreight.cargoType,
          updatedFreight.openedDate,
          updatedFreight.createdBy,
          updatedFreight.id,
        ],
        (_, result) => resolve(result.rowsAffected)
      );
    });
  });
};

const deleteFreight = (freightId) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM freights WHERE id = ?",
        [freightId],
        (_, result) => resolve(result.rowsAffected)
      );
    });
  });
};

export {
  setupFreightsTable,
  getAllFreights,
  addFreight,
  updateFreight,
  deleteFreight,
};
