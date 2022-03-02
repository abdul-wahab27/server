const express = require("express");
const bodyParser = require("body-parser");
const app = express();
let contacts = require("./contacts.json");
const cors = require("cors");
const fs = require("fs");

const token = "hardcodeddummytoken123123123123123123";
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authGaurd = (req, res, next) => {
  if (req.header["auth-token"] == token) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

app.get("/get/contacts", (req, res) => {
  res.json({ data: contacts });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email == "admin" && password == "123123123") {
    res.json({ success: true, token: token });
  } else {
    res.status(401).json({ message: "Loged in successfully." });
  }
});

app.put("/update/contact/:ID", (req, res) => {
  let ID = req.params.ID;
  let found = false;
  let index = -1;
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id == ID) {
      found = true;
      index = i;
      break;
    }
  }

  if (!found) {
    res.status(204).json({ message: "No Contacts found" });
  } else {
    contacts.splice(index, 1);
    contacts.push({ ...req.body });
    res.json({ message: "updated successfully" });
  }
});

app.delete("/delete/contact/:ID", (req, res) => {
  let ID = req.params.ID;
  let found = false;
  let index = -1;
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id == ID) {
      found = true;
      index = i;
      break;
    }
  }

  if (!found) {
    res.status(204).json({ message: "No Contacts found" });
  } else {
    contacts.splice(index, 1);
    res.json({ message: "deleted successfully" });
  }
});

app.post("/create/contact", (req, res) => {
  const { name, email, address, phone } = req.body;
  contacts.push({
    id: Math.floor(Math.random() * 1000000),
    name,
    email,
    address,
    phone,
  });
  fs.writeFileSync("contacts.json", JSON.stringify(contacts));
  res.json({ message: "Saved Successfully" });
});

app.listen(3000, () => {
  console.log("Server listening on 3000 ....");
});
