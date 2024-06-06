const captchaTextBox = document.querySelector(".captch_box input");
const refreshButton = document.querySelector(".refresh_button");
const captchaInputBox = document.querySelector(".captch_input input");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const message = document.querySelector(".message");
const submitButton = document.querySelector(".button");
const captchaContainer = document.getElementById("captcha-container");
const chatbot = document.getElementById("chatbot");
const modeCommentIcon = document.querySelector(
  ".chatbot-toggler .material-symbols-rounded"
);
const closeIcon = document.querySelector(
  ".chatbot-toggler .material-symbols-outlined"
);

// Set the initial state of the icons
closeIcon.style.display = "none";
modeCommentIcon.style.display = "inline";

let captchaText = null;

const generateCaptcha = () => {
  const randomString = Math.random().toString(36).substring(2, 7);
  const randomStringArray = randomString.split("");
  const changeString = randomStringArray.map((char) =>
    Math.random() > 0.5 ? char.toUpperCase() : char
  );
  captchaText = changeString.join("   ");
  captchaTextBox.value = captchaText;
  console.log(captchaText);
};

const refreshBtnClick = () => {
  generateCaptcha();
  captchaInputBox.value = "";
  captchaKeyUpValidate();
};

const captchaKeyUpValidate = () => {
  submitButton.classList.toggle("disabled", !captchaInputBox.value);
  if (!captchaInputBox.value) message.classList.remove("active");
};

const validateCaptcha = () => {
  captchaText = captchaText
    .split("")
    .filter((char) => char !== " ")
    .join("");
  message.classList.add("active");
  if (captchaInputBox.value === captchaText) {
    message.innerText = "Entered captcha is correct";
    message.style.color = "#826afb";
    captchaContainer.style.display = "none";

    // Show chatbot after captcha verification
    chatbot.style.display = "block";
    document.body.classList.add("show-chatbot");

    // Display the close icon and hide the mode_comment icon
    modeCommentIcon.style.display = "none";
    closeIcon.style.display = "inline";

    toggleChatbotToggler();
  } else {
    message.innerText = "Entered captcha is not correct";
    message.style.color = "#FF2525";
  }
};

const toggleChatbotToggler = () => {
  modeCommentIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
};

refreshButton.addEventListener("click", refreshBtnClick);
captchaInputBox.addEventListener("keyup", captchaKeyUpValidate);
submitButton.addEventListener("click", validateCaptcha);

generateCaptcha();

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const handleChat = async () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  try {
    const response = await fetch("/get_response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    const incomingChatLi = createChatLi(responseData.response, "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    const errorLi = createChatLi(
      "Oops! Something went wrong. Please try again.",
      "incoming"
    );
    chatbox.appendChild(errorLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
  modeCommentIcon.style.display = "inline";
  closeIcon.style.display = "none";
});
chatbotToggler.addEventListener("click", () => {
  if (captchaContainer.style.display === "none") {
    captchaContainer.style.display = "block";
    chatbot.style.display = "none";
    modeCommentIcon.style.display = "inline";
    closeIcon.style.display = "none";
  } else {
    captchaContainer.style.display = "none";
    chatbot.style.display = "block";
    modeCommentIcon.style.display = "none";
    closeIcon.style.display = "inline";
  }
});
/* When your mouse cursor enter the background, the fading won't pause and keep playing */
$(".carousel").carousel({
  pause:
    "false" /* Change to true to make it paused when your mouse cursor enter the background */,
});
