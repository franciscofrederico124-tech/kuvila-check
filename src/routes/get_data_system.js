import { data_system } from "../hooks/data_system.js";

async function get_data_system(req, res) {
    try {
        const data = req.body;

        if (data == {} || !data || !data.data) {

            return res.status(400).json({
                success: false,
                message: "Dados inválidos! ",
                controlls: {
                    water_pump: data_system.controlls.water_pump,
                }
            })
        }

        data_system.data = data.data;
        return res.status(200).json({
            success: true,
            message: "Dados recebidos com sucesso! ",
            controlls: {
                water_pump: data_system.controlls.water_pump,
            }
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Erro interno ",
            controlls: {
                water_pump: data_system.controlls.water_pump,
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
            })
        }

        data_system.controlls.water_pump = water_pump;

        return res.status(200).json({
            success: true,
            message: "Comando recebido com sucesso! ",
            controlls: {
                water_pump: data_system.controlls.water_pump,
            }
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro interno ",
            controlls: {
                water_pump: data_system.controlls.water_pump,
            }
        });
    }
}

export {
    get_data_system,
    get_controlls,
}