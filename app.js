import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { engine } from "express-handlebars";
import session from "express-session";
import profile from "./src/routes/profile.js";

import config_db from "./src/routes/config.js";
import { login, logout, auth_login, auth_home } from "./src/routes/middlewares/auth.js";
import { get_data_system, get_controlls,  get_controlls_from_sms } from "./src/routes/get_data_system.js";
import { system, system_consult, system_public } from "./src/hooks/data_system.js";

dotenv.config();
const app = express();
const __dirname = import.meta.dirname;

const port = process.env.PORT || 2000;

app.set("trust proxy", 1);
app.use(express.json());

app.use(cors({
    credentials: true,
}));

app.use(session({
    secret: "kuvila_check_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60,
    }
}));

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./src/views"));

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.static(path.resolve(__dirname, "./node_modules/bootstrap-icons/font")));

config_db();

app.get("/inicio/login", auth_login, (req, res) => {
    res.status(200).render("auth/login", {
        layout: false,
    });
});

app.get("/inicio/logout", auth_home, logout);
app.get("/inicio", auth_home, (req, res) => {
    res.status(200).render("pages/home", {
        isInicio: true
    });
})

app.get("/incio/controle", auth_home, (req, res) => {
    res.status(200).render("pages/controller", {
        isControle: true,
    })
})

app.get("/inicio/como-funciona", auth_home, (req, res) => {
    res.status(200).render("pages/como", {
        isAjuda: true
    })
})

app.get("/inicio/perfil", auth_home, profile);

app.post("/api/login", login);

app.post("/system/data_system", get_data_system);
app.post("/system/controlls", get_controlls);
app.post("/system/controlls/sms", get_controlls_from_sms);
app.post("/system/data", system);
app.post("/system/data/public", system_public);

app.get("/system/consult", system_consult);

app.get("/api/ping", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Pong!",
    });
});


app.get("/", (req, res) => {
    res.status(200).redirect("/inicio");
});

app.listen(port, () => {
    console.log(`
=================================
| > Sistema inicializado         
| > http://127.0.0.1:${port}/   
=================================
    `);
});
