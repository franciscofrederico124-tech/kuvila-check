import db from "../../config/conn.js";
import bcrypt from "bcryptjs";

async function login(req, res) {
    try {
        if (req.session && req.session.user) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "Já tem uma sessão iniciada"
            });
        }

        const data = req.body;
        if (!data || !data.email || !data.password) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "Email ou password inválidos"
            });
        }

        const emailTrim = data.email.trim();
        const passwordTrim = data.password.trim();

        if (passwordTrim.length < 8) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "Email ou password inválidos"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(emailTrim)) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "Email ou password inválidos"
            });
        }

        const verify = db.prepare("SELECT * FROM users WHERE email = ?");
        const data_db = verify.get(emailTrim);

        if (!data_db || !data_db.password) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "Email ou password incorrectos"
            });
        }
        
        const is_valid_user = await bcrypt.compare(passwordTrim, data_db.password);

        if (!is_valid_user) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "Email ou password incorrectos"
            });
        }

        req.session.user = {
            name: data_db.name,
            email: data_db.email,
            id: data_db.id,
            rule: data_db.rule,
        };

        return res.status(200).json({
            success: true,
            status: "success",
            message: "Login efetuado com sucesso!"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            status: "error",
            message: "Erro interno no servidor" + error
        });
    }
}

async function logout(req, res) {

    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/incio/perfil");
        }
        res.clearCookie("connect.sid");
        res.redirect("/inicio/login");
    });

}
async function auth_home(req, res, next) {

    if (!req.session || !req.session.user) {
        return res.redirect("/inicio/login");
    }
    next();
}
async function auth_login(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect("/inicio");
    }
    next();
}

export {
    login,
    auth_login,
    auth_home,
    logout
};
