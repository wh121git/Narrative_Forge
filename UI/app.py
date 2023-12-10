""" Flask app to run a server """
from flask import Flask, render_template, request, jsonify, Response, send_file
import openai
#from openai import OpenAI
#client = OpenAI(
#    api_key="API_KEY"
#)

app = Flask(__name__)

# Set your OpenAI API key here
openai.api_key = 'Api_KEY'

@app.route('/')
def home():
    """Render the home page"""
    return render_template('index.html')

@app.route('/narrative_forge')
def narrative_forge():
    """Render the NarrativeForge page"""
    return render_template('NarrativeForge.html')

messages = [
{"role": "system", "content": "Create a story with five parts: introduction, rising action, climax, falling action, and conclusion. For each part, present two options. Allow the user to choose between the options to determine the direction of the story. Each part should be under 120 words. The conclusion is an exception and doesn't require options. Provide one part at a time, and please do not repeat any parts under any circumstances. refer back to the previous responses to make sure no part is repeated. Clearly label options as 'Option 1' or 'Option 2' after each user choice. I will give you a theme and character to initiate the story."},
]

messages_string = [message['content'] for message in messages]

conversation_history = ' '.join(messages_string)

@app.route('/write_to_file', methods=['POST'])
def write_to_file():
    """
    Write user and bot messages to a file.
    """
    data = request.get_json()
    with open('conversation.txt', 'a', encoding='utf-8') as f:
        f.write('User: ' + data['user'] + '\n')
        f.write('Bot: ' + data['bot'] + '\n')
    return '', 200

@app.route('/download')
def download_file():
    """
    Download the conversation file.
    """
    return send_file('conversation.txt', as_attachment=True)

@app.route('/generate_response', methods=['POST'])
def generate_response():
    """generate response from gpt-3.5-turbo"""
    user_input = request.form['myInput']

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