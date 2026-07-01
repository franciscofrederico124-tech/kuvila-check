import Database from "better-sqlite3";
import path from "path";

const __dirname = import.meta.dirname;

const path_db = path.resolve(__dirname, "../../kuvila.db");


export default new Database(path_db);