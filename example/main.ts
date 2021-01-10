import {createHttpServer} from "../main";

const {startHttpServer} = createHttpServer({
    initialState: {
        userId: 0 
    },
    middlewares: [
        {
            name: "maintainance",
            response: ({state}) => Math.random() > 0.5
                ? ({next: false, status: 503, body: "Server is in maintainance mode", headers: {}})
                : ({next: true, state})
        }
    ],
    routes: [
        {
            name: "home",
            path: "/v1/home",
            method: "GET",
            middlewares: [
                {
                    name: "authentication",
                    response: ({state}) => ({
                        next: true,
                        state: {
                            userId: 1
                        }
                    })
                }
            ],
            response: ({request, state}) => ({
                status: 200,
                body: `Request url is ${request.url} and state is ${state.userId}`,
                headers: {
                    "Content-Type": "text/plain"
                }
            })
        },
        {
            name: "home",
            path: "/v1/users",
            method: "GET",
            middlewares: [],
            response: ({request, state}) => ({
                status: 200,
                body: JSON.stringify(["foo", "bar", "foobar", state]),
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        {
            name: "home",
            path: "/v1/users/:id",
            method: "GET",
            middlewares: [],
            response: ({request, state, parameters}) => ({
                status: 200,
                body: JSON.stringify(parameters.id),
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
    ]
});

(async () => {
    try {
        await startHttpServer({
            port: 8000,
            host: "0.0.0.0"
        });

        console.log("Server started on http://0.0.0.0:8000");
    } catch ({message}) {
        console.error(message);
    }
})();
