const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = require("./server");
const { ensureDatabase } = require("./config/database");

const PORT = process.env.PORT || 4000;

ensureDatabase();

app.listen(PORT, () => {
  console.log(`ACET API listening on http://localhost:${PORT}`);
});
