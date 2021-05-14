const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempVal%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempMin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempMax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Kathmandu&units=metric&appid=7b9fdc9109f22481906b90edb40df664"
    )
      .on("data", (chunk) => {
        // data is event
        const objData = JSON.parse(chunk);

        // console.log(arrData[0].main.temp);
        // console.log(objData.weather[0].main);
        const realTimeData = replaceVal(homeFile, objData);

        res.write(realTimeData);
        // console.log(realTimeData);
        // console.log(val.main);
      })
      .on("end", (err) => {
        // err is event
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1", () =>
  console.log("The connection is successful")
);
