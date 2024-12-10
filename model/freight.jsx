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
          createdBy TEXT,
          status TEXT DEFAULT 'Aberto'
        );`
    );
  });
};

const getAllFreights = (createdBy = null, status = null) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      let query = "SELECT * FROM freights";
      let params = [];

      if (createdBy) {
        query += " WHERE createdBy = ?";
        params.push(createdBy);
      }

      if (status) {
        query += createdBy ? " AND status = ?" : " WHERE status = ?";
        params.push(status);
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
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO freights (origin, destination, value, cargoType, openedDate, createdBy, status) VALUES (?, ?, ?, ?, ?, ?, 'Aberto')",
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
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const updateFreight = (updatedFreight) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE freights SET value = ?, cargoType = ?, openedDate = ?, createdBy = ?, status = ? WHERE id = ?",
        [
          updatedFreight.value,
          updatedFreight.cargoType,
          updatedFreight.openedDate,
          updatedFreight.createdBy,
          updatedFreight.status,
          updatedFreight.id,
        ],
        (_, result) => resolve(result.rowsAffected)
      );
    });
  });
};

const markFreightAsCompleted = (freightId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE freights SET status = ? WHERE id = ?",
        ["Concluído", freightId],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve();
          } else {
            reject("Nenhum registro foi atualizado.");
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

const markFreightAsOpen = (freightId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE freights SET status = ? WHERE id = ?",
        ["Aberto", freightId],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve();
          } else {
            reject("Nenhum registro foi atualizado.");
          }
        },
        (_, error) => reject(error)
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
  markFreightAsCompleted,
  markFreightAsOpen,
};
