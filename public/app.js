/**
 * app.js (Frontend)
 * Handles all UI interactions for the SmileCare Dental AI chat interface.
 * Communicates with the backend via POST /api/chat.
 */

// ─── DOM References ───────────────────────────────────────────────────────────
const chatWindow      = document.getElementById("chatWindow");
const messageInput    = document.getElementById("messageInput");
const sendButton      = document.getElementById("sendButton");
const typingIndicator = document.getElementById("typingIndicator");

// ─── Constants ────────────────────────────────────────────────────────────────
const API_ENDPOINT = "/api/chat";

const QUICK_SUGGESTIONS = [
  "What are your timings?",
  "What services do you offer?",
  "Book Dental Cleaning tomorrow",
  "Book Root Canal next Monday",
];

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Returns the current time formatted as HH:MM AM/PM.
 * @returns {string}
 */
const getCurrentTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

/**
 * Scrolls the chat window to the bottom.
 */
const scrollToBottom = () => {
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

/**
 * Toggles the loading/typing indicator visibility.
 * @param {boolean} visible
 */
const setTyping = (visible) => {
  typingIndicator.classList.toggle("visible", visible);
  scrollToBottom();
};

/**
 * Disables/enables the input controls during a pending request.
 * @param {boolean} loading
 */
const setLoading = (loading) => {
  messageInput.disabled = loading;
  sendButton.disabled   = loading;
};

// ─── Message Rendering ────────────────────────────────────────────────────────

/**
 * Appends a user message bubble to the chat window.
 * @param {string} text
 */
const appendUserMessage = (text) => {
  const row = document.createElement("div");
  row.className = "message-row user";
  row.innerHTML = `
    <div>
      <div class="bubble user">${escapeHtml(text)}</div>
      <span class="bubble-meta">${getCurrentTime()}</span>
    </div>
    <div class="avatar user-avatar">👤</div>
  `;
  chatWindow.appendChild(row);
  scrollToBottom();
};

/**
 * Builds the inner HTML content of a bot response bubble.
 * Renders intent badges, service tags, and date tags for booking responses.
 *
 * @param {object} data - API response payload
 * @returns {string} - HTML string
 */
const buildBotBubbleContent = (data) => {
  let html = "";

  if (data.intent) {
    html += `<span class="intent-badge">${escapeHtml(data.intent)}</span><br/>`;
  }

  html += `<span>${escapeHtml(data.reply)}</span>`;

  if (data.service) {
    html += `<br/><span class="service-tag">🦷 ${escapeHtml(data.service)}</span>`;
  }

  if (data.date && data.date !== "Date not specified") {
    html += `<span class="date-tag">📅 ${escapeHtml(data.date)}</span>`;
  }

  return html;
};

/**
 * Appends a bot response bubble to the chat window.
 * @param {object} data - Parsed API response body
 */
const appendBotMessage = (data) => {
  const row = document.createElement("div");
  row.className = "message-row bot";
  row.innerHTML = `
    <div class="avatar bot-avatar">🤖</div>
    <div>
      <div class="bubble bot">${buildBotBubbleContent(data)}</div>
      <span class="bubble-meta">${getCurrentTime()}</span>
    </div>
  `;
  chatWindow.appendChild(row);
  scrollToBottom();
};

/**
 * Appends an error message bubble (bot-style) to the chat window.
 * @param {string} message
 */
const appendErrorMessage = (message) => {
  appendBotMessage({ reply: `⚠️ ${message}`, intent: null });
};

// ─── API Communication ────────────────────────────────────────────────────────

/**
 * Sends the user message to the backend and renders the response.
 * @param {string} message
 */
const sendMessage = async (message) => {
  if (!message.trim()) return;

  appendUserMessage(message);
  messageInput.value = "";
  autoResizeTextarea();
  setLoading(true);
  setTyping(true);

  try {
    const response = await fetch(API_ENDPOINT, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ message }),
    });

    const data = await response.json();

    setTyping(false);

    if (!response.ok) {
      appendErrorMessage(data.message || "Something went wrong. Please try again.");
      return;
    }

    appendBotMessage(data);
  } catch (error) {
    setTyping(false);
    appendErrorMessage("Network error. Please check your connection and try again.");
  } finally {
    setLoading(false);
    messageInput.focus();
  }
};

// ─── Welcome Screen ───────────────────────────────────────────────────────────

/**
 * Renders the initial welcome card with quick-action suggestion buttons.
 */
const renderWelcomeCard = () => {
  const card = document.createElement("div");
  card.className = "welcome-card";
  card.innerHTML = `
    <h2>👋 Welcome to SmileCare Dental!</h2>
    <p>I'm your AI assistant. I can help you book appointments, check timings, and explore our services.</p>
    <div class="quick-actions">
      ${QUICK_SUGGESTIONS.map(
        (s) => `<button class="quick-btn" data-msg="${escapeHtml(s)}">${escapeHtml(s)}</button>`
      ).join("")}
    </div>
  `;
  chatWindow.appendChild(card);

  // Attach click handlers to quick-action buttons
  card.querySelectorAll(".quick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      card.remove();
      sendMessage(btn.dataset.msg);
    });
  });
};

// ─── Input Helpers ────────────────────────────────────────────────────────────

/**
 * Auto-resizes the textarea to fit its content (up to max-height set in CSS).
 */
const autoResizeTextarea = () => {
  messageInput.style.height = "auto";
  messageInput.style.height = `${messageInput.scrollHeight}px`;
};

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
const escapeHtml = (str) => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// ─── Event Listeners ──────────────────────────────────────────────────────────

sendButton.addEventListener("click", () => sendMessage(messageInput.value));

messageInput.addEventListener("input", autoResizeTextarea);

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage(messageInput.value);
  }
});

// ─── Initialise ───────────────────────────────────────────────────────────────
renderWelcomeCard();
messageInput.focus();
