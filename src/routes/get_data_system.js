import { data_system } from "../hooks/data_system.js";
import dotenv from "dotenv";

dotenv.config();
const access_ = process.env.ACCESS_;

async function get_data_system(req, res) {
    try {
        const data = req.body;

        if (!data || Object.keys(data).length === 0 || !data.data) {
            return res.status(400).json({
                success: false,
                message: "Dados inválidos! ",
                controlls: {
                    water_pump: data_system.controlls.water_pump,
                }
            });
        }

        data_system.data = data.data;
        return res.status(200).json({
            success: true,
            message: "Dados recebidos com sucesso! ",
            controlls: {
                water_pump: data_system.controlls.water_pump,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro interno ",
            controlls: {
                water_pump: data_system.controlls.water_pump,
                error: error.message
            }
        });
    }
}

async function get_controlls(req, res) {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: "Não autorizado! ",
                controlls: {
                    water_pump: null,
                }
            });
        }
        const { water_pump } = req.body;

        if (water_pump === undefined || water_pump === null) {
            return res.status(400).json({
                success: false,
                message: "Dados inválidos! ",
                controlls: {
                    water_pump: data_system.controlls.water_pump,
                }
            });
        }

        data_system.controlls.water_pump = Number(water_pump);

        return res.status(200).json({
            success: true,
            message: "Comando recebido com sucesso! ",
            controlls: {
                water_pump: data_system.controlls.water_pump,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro interno ",
            controlls: {
                water_pump: data_system.controlls.water_pump,
            }
        });
    }
}

async function get_controlls_from_sms(req, res) {
    try {
        const { message, command, access_: clientToken } = req.body;
        const data = req.body;

        console.log(data);

        
        console.log("| > sms: ", message);

        if (clientToken !== access_) {
            return res.status(403).json({
                success: false,
                message: "Não permitido!"
            });
        }

        if (!message || !command) {
            return res.status(400).json({
                success: false,
                message: "Dados incompletos!"
            });
        }

        const cleanCommand = String(command).trim().toUpperCase();

        if (cleanCommand === "LIGAR") {
            console.log(`[EXECUÇÃO]: ${message}`);
            data_system.controlls.water_pump = 1;
        } else if (cleanCommand === "DESLIGAR") {
            console.log(`[EXECUÇÃO]: ${message}`);
            data_system.controlls.water_pump = 0;
            console.log("| > Comando: ", data_system.controlls.water_pump);
        } else {
            console.log(`[LOG]: ${message}`);
        }

        return res.status(200).json({
            success: true,
            message: "Comando recebido e processado no Node.js!",
            water_pump_status: data_system.controlls.water_pump
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro interno ao processar o SMS"
        });
    }
}


export {
    get_data_system,
    get_controlls,
    get_controlls_from_sms,
};
