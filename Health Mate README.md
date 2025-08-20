# 🩺 Health Mate: AI-Powered Medical Chatbot

**Health Mate** is a friendly, web-based medical assistant powered by the **Gemini API**.
It provides **general and safe medical information** in a conversational manner.

⚠️ **Note:** Health Mate is **not a doctor** and should not replace professional medical advice.

---

## ✨ Features

* 🛡️ **Interactive Disclaimer** – Users must acknowledge that the bot is not a real doctor before starting.
* 🌓 **Dual Themes** – Sleek **dark & light mode** for comfortable browsing.
* 🖼️ **Multimedia Support** – Send **text queries** or **upload images** for basic analysis.
* 📑 **Readable Responses** – Bot replies use **Markdown formatting** for headings, bold text, and lists.
* 🔄 **Session Management** – Easily **clear chat history** with a refresh button.

---

## 🚀 Setup & Installation

Follow these steps to get Health Mate running locally:

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd Medical-Chatbot
```

### 2. Create & Activate a Virtual Environment

A virtual environment keeps dependencies isolated.

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a **.env** file in the project’s root directory:

```
GOOGLE_API_KEY="YOUR_API_KEY_HERE"
```

### 5. Run the Application

```bash
flask run
```

or

```bash
python app.py
```

### 6. Open in Browser

Go to: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 📦 Dependencies

* **Flask** – Web framework
* **python-dotenv** – Manage environment variables
* **requests** – API calls to Gemini service
* **mistune** – Parse Markdown in responses

---

## 📸 Preview

> Add a screenshot of your app here for better presentation.
> (Replace this placeholder with your actual screenshot.)

---

## ⚠️ Disclaimer

Health Mate is an **educational tool** and **not a substitute for professional medical advice, diagnosis, or treatment**.
Always consult a licensed healthcare provider for medical concerns.