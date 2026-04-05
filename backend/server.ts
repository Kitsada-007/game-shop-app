import http from "http";
import { app } from "./app";

const port = process.env.port || 3000;
const server = http.createServer(app);
const os = require("os");
let ip = "0.0.0.0";

const ips = os.networkInterfaces();
Object.keys(ips).forEach(function (_interface) {
  ips[_interface].forEach(function (_dev: any) {
    if (_dev.family === "IPv4" && !_dev.internal) ip = _dev.address;
  });
});



server.listen(port, ()=>{
    console.log(`Server is started on http://${ip}:${port}`)
}).on("error" , (error) => {
    console.error(error)
});