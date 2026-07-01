function getSensorStatus(value) {
    const num = Number(value);
    if (isNaN(num)) return { text: "Sem Dados", class: "status-unknown" };

    if (num <= 250) return { text: "Excelente", class: "status-excellent" };
    if (num <= 500) return { text: "Bom", class: "status-good" };
    if (num <= 750) return { text: "Regular", class: "status-regular" };
    if (num <= 900) return { text: "Mau", class: "status-bad" };
    return { text: "Crítico", class: "status-critical" };
}

async function get_data() {
    const tempEl = document.getElementById('air-temp');
    const airHumidEl = document.getElementById('air-humid');
    const soilHumidEl = document.getElementById('soil-humid');
    const qualityEl = document.getElementById('air-quality');

    try {
        const response = await fetch("/system/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const resData = await response.json();

        if (resData.success && resData.data) {
            const sensor = resData.data;

            if (tempEl) tempEl.textContent = `${sensor.air_temperature} °C`;
            if (airHumidEl) airHumidEl.textContent = `${sensor.air_humidity} %`;

            if (soilHumidEl) {
                soilHumidEl.textContent = `${sensor.soil_humidity} %`;
            }

            if (qualityEl) {
                const status = getSensorStatus(sensor.air_quality);
                qualityEl.innerHTML = `<span class="${status.class}">${status.text}</span> <small class="raw-value">(${sensor.air_quality})</small>`;
            }
        }
    } catch (error) {
        console.error("| > Erro ao procurar dados:", error);
    } finally {
        setTimeout(get_data, 11);
    }
}

get_data();
