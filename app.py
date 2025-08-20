import os, base64, requests, mistune, time
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.form.get("message")
    image_file = request.files.get("image")

    
    model = "gemini-1.5-flash-latest"
    
    parts = [{
        "text": (
            "You are a friendly and professional medical assistant AI named Health Mate. "
            "Your persona is caring, empathetic, and knowledgeable. "
            "⚠️ **Disclaimer:** Always start your response by clarifying that you are an AI assistant and not a medical professional, and the user should consult a doctor for any medical advice. "
            "Provide safe, general, and well-explained advice. "
            "Format your response using Markdown for better readability. "
            "Use headings, bold text, and bullet points to structure your answer into the following sections:\n"
            "1.  **Possible Causes**\n"
            "2.  **Self-Care Guidance**\n"
            "3.  **When to See a Doctor**\n\n"
            f"**User's Query:** {user_text}"
        )
    }]

    if image_file:
        img_bytes = image_file.read()
        parts.append({
            "inline_data": {
                "mime_type": image_file.mimetype,
                "data": base64.b64encode(img_bytes).decode("utf-8")
            }
        })

    try:
        time.sleep(1)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = {"contents": [{"parts": parts}]}
        
        resp = requests.post(url, headers=headers, json=payload, timeout=120)
        resp.raise_for_status()
        
        data = resp.json()
        
        bot_reply = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "⚠️ I'm sorry, I couldn't process your request. Please try again.")
        )
        bot_reply = mistune.markdown(bot_reply)

    except requests.exceptions.RequestException as e:
        bot_reply = f"<p><strong>Error:</strong> A network error occurred. Please check your connection and try again later.</p><p><code>{e}</code></p>"
    except Exception as e:
        bot_reply = f"<p><strong>Error:</strong> An unexpected error occurred while processing your request. Please try again later.</p><p><code>{e}</code></p>"

    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(debug=True)