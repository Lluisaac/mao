const http = require("./httpserver");
const mao = require("./maoserver");

const app = http.launch();
mao.launch(app);