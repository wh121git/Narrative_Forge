""" Flask app to run a server """
from flask import Flask, render_template, request, jsonify
import openai
from openai import OpenAI
client = OpenAI()

app = Flask(__name__)

# Set your OpenAI API key here
openai.api_key = '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'

@app.route('/')
def home():
    """Render the home page"""
    return render_template('index.html')

@app.route('/generate_response', methods=['POST'])
def generate_response():
    """generate response from gpt-3.5-turbo"""
    user_input = request.form['user_input']

    # Call the OpenAI API to get a response
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: "+user_input+"\nAI:"},
            {"role": "user", "content": user_input,}
            ],
        max_tokens=2200,
    )

    print(response.choices[0].message)
    
    if not isinstance(response, dict):
        print(f"Unexpected response type: {type(response)}")
        return jsonify({'bot_response': 'An error occurred'})

    # bot_response = response.choices[0].message.content

    # You can store the conversation history in a database or in-memory data structure

    return jsonify({'bot_response': response})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
