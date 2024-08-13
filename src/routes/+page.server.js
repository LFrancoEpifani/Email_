import { mysqlconnFn } from "$lib/db/mysql";


export async function load() {
  let mysqlconn = await mysqlconnFn();
  let queryStr = "SELECT * FROM email";
  let params = [];


  try {
    let results = await mysqlconn.query(queryStr, params).then(function ([rows, fields]) {
      return rows;
    });

    return {
      data: results,
    };
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return {
      status: 500,
      error: new Error("Failed to load emails")
    };
  }
}
