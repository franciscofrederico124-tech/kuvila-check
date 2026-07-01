import db from "../config/conn.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export default async function config_db() {
    try {
        console.log(" | > Configurando sistema...");
        const init_table = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            password TEXT NULL,
            email TEXT NOT NULL,
            rule TEXT NOT null
        )
    `;

        db.exec(init_table);
        console.log(" | > Tabela criada / verficada com sucesso!");
        console.log(process.env.DEFAULT_PASSWORD)
        const default_user = {
            name: "Kuvila Admin",
            email: "kuvilaadmin@gmail.com",
            password: process.env.DEFAULT_PASSWORD || "12345678",
            rule: "Admin geral",
        };

        const create_default_user = db.prepare(`
            INSERT INTO users (name, email, password, rule) 
            VALUES (@name, @email, @password, @rule)
        `);

        const verify_default_user = db.prepare(`
            SELECT * FROM users WHERE name = ? AND email = ?
        `);

        const data = verify_default_user.get(default_user.name, default_user.email);

        if (!data) {
            const hashed_password = await bcrypt.hash(default_user.password, 10);
            create_default_user.run({
                name: default_user.name,
                email: default_user.email,
                password: hashed_password,
                rule: default_user.rule,
            });

            console.log("| > Usuario admin padrão configurado com sucesso!");
        } else {
            console.log(" | > Usuário padrão já está configurado!");
        }
        console.log(" | > Configuração completa!");
    }
    catch (error) {
        console.log(" | > Erro ao configurar sistema! ", error);
    }
}
