const fs = require("fs");
const tmpl = require("blueimp-tmpl");
const openpgp = require("openpgp");
const path = require("path");

const run = async () => {
  try {
    const label = null;
    const verification = "TESTE2";
    const author = "Teste";

    const template = fs.readFileSync("./templates/cute.html", "utf8");

    const url = "https://github.com/";

    const data = {
      theme: { primary: "#333", secondary: "#666" },
      object: { url, label: "Teste", key: "890sa09d809sad" },
      author,
    };

    fs.writeFileSync("da.html", tmpl(template, data));
  } catch (error) {
    console.log(error);
  }
};

run();
