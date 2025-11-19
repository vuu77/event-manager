document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("events-container");

    try {
        const response = await fetch("/api/events");
        const events = await response.json();

        events.forEach(event => {
            const div = document.createElement("div");
            div.className = "event";
            div.innerHTML = `
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        container.innerHTML = "<p>Failed to load events.</p>";
        console.error(error);
    }
});
