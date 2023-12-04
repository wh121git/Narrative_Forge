""" Flask app to run a server """
from flask import Flask, render_template, request, jsonify, Response
import openai
#from openai import OpenAI
#client = OpenAI(
#    api_key="API_KEY"
#)

app = Flask(__name__)

# Set your OpenAI API key here
openai.api_key = 'API_KEY'

@app.route('/')

def home():
    """Render the home page"""
    return render_template('index.html')

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
]

@app.route('/generate_response', methods=['POST'])
def generate_response():
    """generate response from gpt-3.5-turbo"""
    user_input = request.form['user_input']

    # Append the user's message to the conversation histroy(messages array)
    messages.append({"role": "user", "content": user_input})

    # Call the OpenAI API to get a response
    response = openai.chat.completions.create(
    messages=messages,
    model="gpt-3.5-turbo",
)
    ai_response = response.choices[0].message.content
    print(ai_response)
    if not isinstance(ai_response, str):
        print(f"Unexpected response type: {type(ai_response)}")
        return jsonify({'bot_response': 'An error occurred'})

    bot_response = ai_response

    # Append the bot_response to the conversation history(messages array)
    messages.append({"role": "assistant", "content": bot_response})

    # generate an image with dall-e using the users prompt
    image_response = openai.images.generate(
        model = "dall-e-3",
        prompt = user_input + bot_response,
        size = "1024x1024",
        quality = "standard",
        n=1,
    )

    print (image_response.__dict__)
    image_url = image_response.data[0].url

    return jsonify({'bot_response': bot_response, 'image_url': image_url})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
