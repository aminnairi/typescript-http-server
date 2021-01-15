import sqlite3 from "sqlite3";
import {open} from "sqlite";
import {createHttpServer} from "@aminnairi/typescript-http-server";


const main = async () => {
  const database = await open({
    filename: "database.db",
    driver: sqlite3.Database
  });

  await database.exec("DROP TABLE IF EXISTS test;");
  await database.exec("CREATE TABLE test(id INT, value TEXT);");
  await database.exec("INSERT INTO test VALUES (1, 'foo');");
  await database.exec("INSERT INTO test VALUES (2, 'bar');");
  await database.exec("INSERT INTO test VALUES (3, 'foobar');");

  const {startHttpServer} = createHttpServer({
    initialState: null,
    middlewares: [],
    routes: [
      {
        // http://127.0.0.1:8000/v1/test
        version: 1,
        prefix: "",
        name: "Test",
        path: "/test",
        method: "GET",
        middlewares: [],
        children: [],
        response: async () => {
          try {
            const result = await database.all("SELECT * FROM test;");

            return {
              status: "OK",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                success: true,
                data: result
              })
            };
          } catch (error) {
            return {
              status: "INTERNAL_SERVER_ERROR",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                success: false,
                error: error.message
              })
            };
          }
        }
      }
    ],
    fallback: () => ({
      status: "NOT_FOUND",
      headers: {
        "Content-Type": "text/plain"
      },
      body: "Not found"
    })
  });

  const port = 8000;
  const host = "127.0.0.1";

  await startHttpServer({
    port,
    host
  });

  console.log(`Server started on http://${host}:${port}`);
};

main().catch(console.error);
