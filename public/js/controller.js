const bombaToggle = document.getElementById('bomba-toggle');
const bombaStatus = document.getElementById('bomba-status');
const soil_humidity = document.getElementById('soil-humidity');

async function consultarEstadoBomba() {
    try {
        const response = await fetch("/system/consult", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        if (data && data.data && data.data.controlls) {

            if (soil_humidity) {
                soil_humidity.textContent = `${data.data.data.soil_humidity} %`;
            }
            const isOn = data.data.controlls.water_pump === 1;

            if (bombaToggle) bombaToggle.checked = isOn;
            if (bombaStatus) {
                bombaStatus.textContent = isOn ? 'Ligado' : "Desligado";
                bombaStatus.className = isOn ? 'status-badge status-on' : "status-badge status-off";
            }
        }
    } catch (error) {
        console.error('Erro ao consultar sistema:', error);
    } finally {
        setTimeout(consultarEstadoBomba, 11);
    }
}

if (bombaToggle && bombaStatus) {
    bombaToggle.addEventListener('change', async function () {
        const novoEstado = this.checked ? 1 : 0;
        const estadoAnterior = !this.checked;

        try {
            const response = await fetch('/system/controlls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ water_pump: novoEstado })
            });
            const data = await response.json();

            if (data && data.success) {
                bombaStatus.textContent = novoEstado === 1 ? 'Ligado' : 'Desligado';
                bombaStatus.className = novoEstado === 1 ? 'status-badge status-on' : 'status-badge status-off';
            } else {
                this.checked = estadoAnterior;
                console.error('Servidor rejeitou a alteração');
            }
        } catch (error) {
            this.checked = estadoAnterior;
            console.error('Erro ao enviar a solicitação:', error);
        }
    });
}

consultarEstadoBomba();