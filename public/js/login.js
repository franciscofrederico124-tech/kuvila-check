const form = document.getElementById("form");
const email_input = document.getElementById("email");
const password_input = document.getElementById("password");
const go = document.getElementById("go");
const feedback = document.querySelector(".feedback");

form.addEventListener("submit", login);

async function login(event) {
    event.preventDefault();

    try {
        const email = email_input.value.trim();
        const password = password_input.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            await set_feedback(" Email ou password errados ", "error");
            return;
        }
        if (!password || password.length < 8) {
            await set_feedback(" Email ou password errados ", "error");
            return;
        }

        const textoOriginalBotao = go.textContent;
        go.textContent = " Entrando...";
        go.disabled = true;

        const data = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const res = await data.json();

        go.textContent = textoOriginalBotao;
        go.disabled = false;

        if (!res) {
            await set_feedback(" Algo de errado. Tente novamente", "error");
            return;
        }

        await set_feedback(res.message, res.status);

        if (res.status === "success" && res.success) {
            window.location.href = "/inicio";
        }
    }
    catch (error) {
        go.textContent = "Entrar";
        go.disabled = false;
        await set_feedback("Erro interno!", "error");
    }
}

async function set_feedback(message, type) {
    const className = (type === "error" ? "feedback_error" : "feedback_success");
    feedback.textContent = message.trim();
    feedback.classList.add(className);

    setTimeout(() => {
        feedback.textContent = "";
        feedback.classList.remove("feedback_error");
        feedback.classList.remove("feedback_success");
    }, 1500);
}
