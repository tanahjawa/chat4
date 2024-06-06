from flask import Flask, request, jsonify
import json
from flask import Flask, request, jsonify, render_template
import random
from transformers import BertForSequenceClassification, BertTokenizerFast, pipeline

app = Flask(__name__)

# Tentukan path di mana model, tokenizer, label mappings, dan intents disimpan
model_path = 'model/'

# Load model dan tokenizer
model = BertForSequenceClassification.from_pretrained(model_path)
tokenizer = BertTokenizerFast.from_pretrained(model_path)

# Inisialisasi chatbot pipeline
chatbot = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

# Load label mappings dan intents
with open(f'{model_path}/label_mappings.json', 'r') as f:
    label_mappings = json.load(f)

# Load intents
with open(f'{model_path}/intents.json', 'r') as f:
    intents = json.load(f)

label2id = label_mappings['label2id']
id2label = label_mappings['id2label']

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    text = data['text']
    
    # Prediksi sentiment
    result = chatbot(text)
    
    # Ambil label sentiment
    label = result[0]['label']
    
    # Convert label menjadi nilai numerik
    sentiment_id = label2id[label]
    
    # Ambil nama sentiment
    sentiment_name = id2label[str(sentiment_id)]
    
    return jsonify({'sentiment': sentiment_name})

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get("message")
    outputs = chatbot(user_input)
    pred_label = outputs[0]['label']
    
    if outputs[0]['score'] < 0.8:
        response = "Sorry I can't answer that"
    else:
        label_id = label2id[pred_label]
        response = random.choice(intents['intents'][label_id]['responses'])
    
    return jsonify({"response": response})

def chat(chatbot):
    print("Chatbot: Hi! I am your virtual assistance,Feel free to ask, and I'll do my best to provide you with answers and assistance..")
    print("Type 'quit' to exit the chat\n\n")
    
    text = input("User: ").strip().lower()
    
    while(text != 'quit'):
        score = chatbot(text)[0]['score']
        
        if score < 0.8:
            print("Chatbot: Sorry I can't answer that\n\n")
            text = input("User: ").strip().lower()
            continue
        
        label = label2id[chatbot(text)[0]['label']]
        response = random.choice(intents['intents'][label]['responses'])
        
        print(f"Chatbot: {response}\n\n")
            
        text = input("User: ").strip().lower()

if __name__ == '__main__':
    app.run(debug=True)
