import express from "express";
// @ts-ignore
import process from "node:process";

export function runListener(msg: string, portNum: number){
    const app = express();

    // @ts-ignore
    app.get('/', (req, res) =>
        res.send(msg)
    );

    const port = process.env.PORT || portNum;

    app.listen(port, () => console.log(`Started server on http://localhost:${port}/`));
}

const html = "<html>" +
    "<head>" +
    "<title>Awesome title</title>" +
    "</head>" +
    "<body>" +
    "<h1 style='color: blueviolet'>Some header 1</h1>" +
    "<button>Click Me!</button>" +
    "</body>" +
    "</html>"

runListener(html, 8080);
