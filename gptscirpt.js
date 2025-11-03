const sendBtn = document.getElementById("sendBtn");
const userMessage = document.getElementById("userMessage");
const chatBox = document.getElementById("chat");

sendBtn.addEventListener("click", async () => {
  const message = userMessage.value.trim();z
  if (!message) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = "message";
  messageDiv.textContent = "Loading...";
  chatBox.appendChild(messageDiv);

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    // Clear previous text
    messageDiv.innerHTML = "";

    // Render title and body
    const titleEl = document.createElement("h2");
    titleEl.textContent = data.title;
    const bodyEl = document.createElement("p");
    bodyEl.textContent = data.body;

    messageDiv.appendChild(titleEl);
    messageDiv.appendChild(bodyEl);

  } catch (err) {
    messageDiv.textContent = "Error: could not connect to GPT-5.";
    console.error(err);
  }

  userMessage.value = "";
});
