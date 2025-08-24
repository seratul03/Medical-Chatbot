document.addEventListener("DOMContentLoaded", function () {
  const disclaimerModal = document.getElementById("disclaimer-modal");
  const disclaimerCheckbox = document.getElementById("cbx2");
  const continueBtn = document.getElementById("continue-btn");

  const body = document.body;
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const imageInput = document.getElementById("image-input");
  const imagePreview = document.getElementById("image-preview");
  const chatBox = document.getElementById("chat-box");
  const refreshBtn = document.getElementById("refresh-btn");
  const logoutBtn = document.querySelector(".Btn");
  const themeToggle = document.getElementById("switch");
  const exitModal = document.getElementById("exit-modal");
  const exitYes = document.getElementById("exit-yes");
  const exitNo = document.getElementById("exit-no");

  let disclaimerVisible = true;

  
  disclaimerCheckbox.addEventListener("change", function () {
    continueBtn.disabled = !this.checked;
  });

  
  continueBtn.addEventListener("click", function () {
    disclaimerModal.style.display = "none";
    disclaimerVisible = false;
  });

  
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

  
  imageInput.addEventListener("change", function () {
    imagePreview.innerHTML = "";
    if (this.files && this.files[0]) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(this.files[0]);

      const removeBtn = document.createElement("div");
      removeBtn.className = "remove-btn";
      removeBtn.innerHTML = "&times;";

      removeBtn.addEventListener("click", () => {
        imageInput.value = "";
        imagePreview.innerHTML = "";
      });

      imagePreview.appendChild(img);
      imagePreview.appendChild(removeBtn);
    }
  });

  
  chatForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    let userMessage = userInput.value.trim();
    if (!userMessage && !imageInput.files[0]) return;

    if (disclaimerVisible) {
      disclaimerModal.style.display = "none";
      disclaimerVisible = false;
    }

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
    imagePreview.innerHTML = ""; 
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

  
  userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.requestSubmit();
    }
  });

  
  refreshBtn.addEventListener("click", function () {
    chatBox.innerHTML = "";
    refreshBtn.classList.add("rotating");
    disclaimerModal.style.display = "flex";
    disclaimerVisible = true;
  });

  refreshBtn.addEventListener("animationend", function () {
    refreshBtn.classList.remove("rotating");
  });


  logoutBtn.addEventListener("click", function () {
    exitModal.style.display = "flex";
  });

  exitYes.addEventListener("click", function () {
    window.close();
    exitModal.style.display = "none";
  });

  exitNo.addEventListener("click", function () {
    exitModal.style.display = "none";
  });
});
