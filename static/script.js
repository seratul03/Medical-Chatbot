document.addEventListener("DOMContentLoaded", function () {

  const disclaimerModal = document.getElementById("disclaimer-modal");
  const disclaimerCheckbox = document.getElementById("cbx2");
  const continueBtn = document.getElementById("continue-btn");


  disclaimerCheckbox.addEventListener("change", function () {
    if (this.checked) {
      continueBtn.disabled = false;
    } else {
      continueBtn.disabled = true;
    }
  });

  
  continueBtn.addEventListener("click", function () {
    disclaimerModal.style.display = "none";
  });

  const body = document.body;
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const imageInput = document.getElementById("image-input");
  const chatBox = document.getElementById("chat-box");
  const refreshBtn = document.getElementById("refresh-btn");
  const logoutBtn = document.querySelector(".Btn"); 
  const themeToggle = document.getElementById("switch");

  if (themeToggle) {
    const applyTheme = (theme) => {
      if (theme === "dark") {
        body.classList.add("dark-mode");
        themeToggle.checked = true;
      } else {
        body.classList.remove("dark-mode");
        themeToggle.checked = false;
      }
    };
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        localStorage.setItem("theme", "dark");
        applyTheme("dark");
      } else {
        localStorage.setItem("theme", "light");
        applyTheme("light");
      }
    });
  }

  chatForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    let userMessage = userInput.value.trim();
    if (!userMessage && !imageInput.files[0]) return;

    if (userMessage) {
      let userDiv = document.createElement("div");
      userDiv.className = "message user";
      userDiv.innerText = userMessage;
      chatBox.appendChild(userDiv);
    }

    if (imageInput.files[0]) {
      let imageDiv = document.createElement("div");
      imageDiv.className = "message user";
      let img = document.createElement("img");
      img.src = URL.createObjectURL(imageInput.files[0]);
      img.style.maxWidth = "200px";
      img.style.borderRadius = "15px";
      imageDiv.appendChild(img);
      chatBox.appendChild(imageDiv);
    }

    let formData = new FormData();
    formData.append("message", userMessage);
    if (imageInput.files[0]) formData.append("image", imageInput.files[0]);

    userInput.value = "";
    imageInput.value = "";
    userInput.style.height = "auto";

    let botDiv = document.createElement("div");
    botDiv.className = "message bot";
    let typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = "<span></span><span></span><span></span>";
    botDiv.appendChild(typingIndicator);
    chatBox.appendChild(botDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const response = await fetch("/chat", { method: "POST", body: formData });
      const data = await response.json();
      botDiv.innerHTML = data.reply;
    } catch (error) {
      botDiv.innerHTML =
        "<p><strong>Error:</strong> Failed to get a response from the server. Please try again.</p>";
    } finally {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

  userInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.requestSubmit();
    }
  });

  refreshBtn.addEventListener("click", function () {
    chatBox.innerHTML = "";
    refreshBtn.classList.add("rotating");
  });

  refreshBtn.addEventListener("animationend", function () {
    refreshBtn.classList.remove("rotating");
  });


  logoutBtn.addEventListener("click", function () {
    disclaimerModal.style.display = "flex";
    disclaimerCheckbox.checked = false;
    continueBtn.disabled = true;
  });
});
