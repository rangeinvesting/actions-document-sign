const fs = require("fs");
const tmpl = require("blueimp-tmpl");
const openpgp = require("openpgp");
const path = require("path");
const crypto = require("crypto");
const fetch = require("node-fetch");
const FormData = require("form-data");

async function main() {
  const formData = new FormData();
  formData.append("url", "https://3xqz5t-3000.csb.app");
  const res = await fetch(
    "https://demo.gotenberg.dev/forms/chromium/convert/url",
    {
      method: "POST",
      body: formData,
    }
  );
  const pdfBuffer = await res.buffer();
  // You can do whatever you like with the pdfBuffer, such as writing it to the disk:
  fs.writeFileSync("./myfile.pdf", pdfBuffer);
}

const run = async () => {
  try {
    const label = null;
    const verification = "TESTE2";
    const author = "Teste";
    const key = crypto
      .createHmac("SHA256", "secret")
      .update("Message")
      .digest("base64");

    const passphrase = `yourPassphrase`; // what the private key is encrypted with

    const { privateKey, publicKey, revocationCertificate } =
      await openpgp.generateKey({
        type: "ecc", // Type of the key, defaults to ECC
        curve: "curve25519", // ECC curve name, defaults to curve25519
        userIDs: [{ name: "Jon Smith", email: "jon@example.com" }], // you can pass multiple user IDs
        passphrase, // protects the private key
        format: "armored", // output key format, defaults to 'armored' (other options: 'binary' or 'object')
      });
    console.log(privateKey);

    const template = fs.readFileSync("./templates/cute.html", "utf8");

    const url = "https://github.com/";

    const data = {
      theme: { primary: "#333", secondary: "#666" },
      object: { url, label: "Assinou para aprovar", key, key2: key },
      author,
      date: new Date(),
    };

    fs.writeFileSync("da.html", tmpl(template, data));

    await main();

    //await encrypt(privateKey);
  } catch (error) {
    console.log(error);
  }
};

async function encrypt(publicKeyArmored) {
  const plainData = fs.readFileSync("da.html", "utf8");
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromText(plainData.toString()),
    publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys,
  });

  fs.writeFileSync("da-encrypted-html", encrypted.data);
}

(async () => {
  await run();
})();
