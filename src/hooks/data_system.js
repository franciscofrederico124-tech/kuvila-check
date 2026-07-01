let data_system = {
    "system": { firmware: 'Esp32 - kuvila check', version: '1.0.0' },
    "data": {
        "air_quality": "...",
        "air_humidity": "...",
        "air_temperature": "...",
        "soil_humidity": "...",
    },
    "controlls": { "water_pump": 0 }
}

async function system(req, res) {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: "Não autorizado! ",
                data: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Dados recebidos com sucesso! ",
            data: data_system.data,
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Erro interno ",
            data: null,
        });
    }
}

async function system_consult(req, res) {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: "Não autorizado! ",
                data: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Dados do sistema recebidos com sucesso! ",
            data: data_system,
        });

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Erro interno ",
            data: data_system.data,
        });
    }
}


export { data_system, system, system_consult };