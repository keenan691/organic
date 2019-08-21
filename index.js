require('node-libs-react-native/globals')

// console.log(nl);
const { createClient } = require("webdav");

const client = createClient(
  "http://192.168.1.7:5000/Documents/",
  {
    username: "admin",
    password: "koyote69."
  }
);

console.log(client);
const stat = client.getFileContents("/someday.org", {format:'text'}).then( (data) => {
  console.log(data);
}
                                                                     )

// // import './src/app';
require('./src/app')
