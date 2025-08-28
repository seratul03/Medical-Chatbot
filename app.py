import os, base64, requests, mistune, time, secrets
from flask import Flask, render_template, request, jsonify, session
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

app = Flask(__name__)

app.secret_key = secrets.token_hex(16)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.form.get("message")
    image_file = request.files.get("image")
    
    
    chat_history = session.get('chat_history', [])

    model = "gemini-1.5-flash-latest"

    
    user_parts = []
    
   
    if not chat_history:
        system_prompt = (
            "You are a friendly and professional, experienced medical assistant AI named Health Mate. "
            "Your persona is caring, empathetic, and knowledgeable. "
            "Do not repeat disclaimers in every message. "
            "Provide safe, general, and well-explained advice. "
            "Format responses in Markdown for readability. "
            "Always provide some special, take care or other health wishing notes. "
            "If asked about a disease, explain it clearly and always include some prevention tips.\n\n"
            f"**User's Query:** {user_text}"
        )
        user_parts.append({"text": system_prompt})
    else:
        user_parts.append({"text": user_text})

    if image_file:
        img_bytes = image_file.read()
        user_parts.append({
            "inline_data": {
                "mime_type": image_file.mimetype,
                "data": base64.b64encode(img_bytes).decode("utf-8")
            }
        })

    
    chat_history.append({"role": "user", "parts": user_parts})

    try:
        time.sleep(2)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
        headers = {"Content-Type": "application/json"}
        
        payload = {"contents": chat_history}

        resp = requests.post(url, headers=headers, json=payload, timeout=120)


        resp.raise_for_status()
        
        data = resp.json()

       
        raw_bot_reply = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "⚠️ I'm sorry, I couldn't process your request. Please try again.")
        )
        
       
        chat_history.append({"role": "model", "parts": [{"text": raw_bot_reply}]})
        
      
        session['chat_history'] = chat_history


        html_bot_reply = mistune.markdown(raw_bot_reply)

    except requests.exceptions.RequestException as e:
        html_bot_reply = f"<p><strong>Error:</strong> A network error occurred. Please check your connection and try again later.</p><p><code>{e}</code></p>"
    except Exception as e:
        html_bot_reply = f"<p><strong>Error:</strong> An unexpected error occurred while processing your request. Please try again later.</p><p><code>{e}</code></p>"

    return jsonify({"reply": html_bot_reply})


@app.route("/clear", methods=["POST"])
def clear_chat():
    session.pop('chat_history', None)
    return jsonify({"status": "cleared"})

if __name__ == "__main__":
    app.run(debug=True)