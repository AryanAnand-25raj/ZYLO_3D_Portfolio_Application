const fs = require("fs");
const path = require("path");

const strayFiles = ["console.log('3D", "{", "powershell.bat", "powershell.cmd"];

for (const f of strayFiles) {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log("Deleted:", f);
  }
}
