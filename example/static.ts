import {createHttpServer} from "@aminnairi/typescript-http-server";
import {promises as fs} from "fs";
import {resolve, extname} from "path";

const extensionMimeTypes: Record<string, string> = {
  ".ts": "text/plain",
  ".js": "application/javascript",
  ".json": "application/json",
  ".html": "text/html",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const {startHttpServer} = createHttpServer({
  initialState: null,
  middlewares: [],
  routes: [
    {
      // http://127.0.0.1:8000/static/async.ts
      // http://127.0.0.1:8000/static/simple.ts
      // http://127.0.0.1:8000/static/parameters.ts
      name: "Static file serving (example folder)",
      prefix: "/static",
      version: 0,
      path: ":file",
      method: "GET",
      middlewares: [],
      response: async ({parameters: {file}}) => {
        try {
          const fileName = file || "";
          const fileExtension = extname(fileName);
          const filePath = resolve(__dirname, fileName);
          const fileContent = await fs.readFile(filePath);
          const fileMimeType = extensionMimeTypes[fileExtension] ?? "text/plain";

          return {
            status: "OK",
            headers: {
              "Content-Type": fileMimeType,
            },
            body: fileContent.toString()
          };
        } catch {
          return {
            status: "NOT_FOUND",
            headers: {
              "Content-Type": "text/plain"
            },
            body: `File ${file || "unknown"} is not found in the example folder.`
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

const main = async () => {
  const port = 8000;
  const host = "127.0.0.1";

  await startHttpServer({
    port,
    host
  });

  console.log(`Server started on http://${host}:${port}`);
};

main().catch(console.error);
