const bombaToggle = document.getElementById('bomba-toggle');
const bombaStatus = document.getElementById('bomba-status');
const soil_humidity = document.getElementById('soil-humidity');

let consultaTimeoutId = null;
let enviandoComando = false;

async function consultarEstadoBomba() {
    if (enviandoComando) {
        agendarProximaConsulta(2000);
        return;
    }

    try {
        const response = await fetch("/system/consult", { method: "GET" });
        const data = await response.json();

        if (data && data.data) {
            if (soil_humidity && data.data.data) {
                soil_humidity.textContent = `${data.data.data.soil_humidity || 0} %`;
            }

            if (data.data.controlls) {
                const isOn = data.data.controlls.water_pump === 1;

                if (!enviandoComando) {
                    if (bombaToggle && bombaToggle.checked !== isOn) {
                        bombaToggle.checked = isOn;
                    }
                    atualizarInterfaceBomba(isOn);
                }
            }
        }
    } catch (error) {
        console.error('Erro ao consultar sistema:', error);
    } finally {
        agendarProximaConsulta(2000);
    }
}

function agendarProximaConsulta(tempo) {
    clearTimeout(consultaTimeoutId);
    consultaTimeoutId = setTimeout(consultarEstadoBomba, tempo);
}

function atualizarInterfaceBomba(isOn) {
    if (!bombaStatus) return;
    bombaStatus.textContent = isOn ? 'Ligado' : "Desligado";
    bombaStatus.className = isOn ? 'status-badge status-on' : "status-badge status-off";
}

if (bombaToggle && bombaStatus) {
    bombaToggle.addEventListener('click', async function (event) {
        if (enviandoComando) {
            event.preventDefault();
            return;
        }

        enviandoComando = true;
        clearTimeout(consultaTimeoutId);

        const novoEstado = this.checked ? 1 : 0;
        const estadoAnterior = !this.checked;

        atualizarInterfaceBomba(this.checked);

        try {
            const response = await fetch('/system/controlls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ water_pump: novoEstado })
            });
            const data = await response.json();

            if (!data || !data.success) {
                this.checked = estadoAnterior;
                atualizarInterfaceBomba(estadoAnterior);
                console.error('Servidor rejeitou a alteração');
            }
        } catch (error) {
            this.checked = estadoAnterior;
            atualizarInterfaceBomba(estadoAnterior);
            console.error('Erro ao enviar a solicitação:', error);
        } finally {
            setTimeout(() => {
                enviandoComando = false;
                agendarProximaConsulta(2000);
            }, 1000);
        }
    });
}

consultarEstadoBomba();
