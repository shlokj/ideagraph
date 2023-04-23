#import functions/classes
from model import create_new_node, co, generate_keyword_from_sentence
from pre_process import data_preprocess
from structure import Graph, Node, Autocomplete
from auto_complete import auto_complete, query_complete

#import Relevant libraries
from flask import Flask, request, make_response, redirect, url_for, jsonify, flash
from werkzeug.utils import secure_filename
from flask_cors import CORS
from whisp import run_whisper
from fastapi import FastAPI, HTTPException
import requests
import os

graph = Graph()

# Define App:
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

_path = _path = os.getcwd() +  "/uploads/"
app.config['UPLOAD_FOLDER'] = _path  # Choose the folder where you want to save the uploaded files.
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Set the maximum allowed file size to 16 MB.
app.config['SECRET_KEY'] = 'your secret key'  # Set your secret key for flash messages.

ALLOWED_EXTENSIONS = {'txt', 'wav', 'mp3'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


### Define Routes:
# Home-Page API:
@app.route('/')
def home():
    return "HOME"

#string text input
@app.route("/user_input", methods = ['POST'])
def process_user_input():
    if request.method == "POST":
        user_text = request.json['text']


        # Generate the URL for the target endpoint
        response = requests.get(f"http://127.0.0.1:8080/graph_object/{user_text}")

        # # Make an HTTP request to the target endpoint
        # response = requests.get(endpoint2_url)
    return response.content

@app.route("/graph_object/<string:text>", methods = ['GET'])
def process_graph_object(text):
    text_sentences = data_preprocess(text)
    for sentence in text_sentences:
        if (sentence == ""):
            raise HTTPException(status_code=404, detail="Sentence cannot be null.")
        create_new_node(sentence, None, graph)
    return graph.to_json()

#autocompleter - pass in the Node ID in the JSON
@app.route('/post/autocomplete', methods = ['POST'])
def process_user_autocomplete():
    if request.method == "POST":
        id = request.json['id']
        # Generate the URL for the target endpoint
        response = requests.get(f"http://127.0.0.1:8080/get/autocomplete/{id}")
        # # Make an HTTP request to the target endpoint
        # response = requests.get(endpoint2_url)
    return response.content

#autocompleter - Get request
@app.route('/get/autocomplete/<string:id>', methods = ['GET'])
def process_autocomplete_data(id):
    print("id: " + id)
    print(graph.get_nodes_ids())
    lst = graph.get_nodes_ids()
    for i in range(len(lst)):
        if (str(lst[i]) == str(id)):
            node = graph.get_node(str(id))
            sentence = node.get_payload()
            response = auto_complete(sentence)
            #parent id and response in autocompleted graph
            create_new_node(response, Autocomplete(response, id), graph)
            return {
                "autocomplete_data": response + " [AUTOCOMPLETED NODE!]",
                "graph_data": graph.to_json()
            }
    return {
        "autocomplete_data": "node not found!"
    }

#audio input
@app.route('/user_input/audio/', methods = ['POST', 'GET'])
def process_user_audio_input():
    print(request.method)
    if request.method == 'POST':
        print(request.files)
        if 'fileName' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['fileName']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            if (".wav" in filename or ".mp3" in filename):
                text = run_whisper(_path + filename)

                payload = {"text": text}
            flash('File uploaded successfully.')
            print(jsonify({"success": "File uploaded successfully 200."}))

        response = requests.get(f"http://127.0.0.1:8080/graph_object_from_file/", params = payload)
        return response.content

    return '''
    <!doctype html>
    <title>Upload File</title>
    <h1>Upload File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

#file input
@app.route('/user_input/text/', methods = ['POST', 'GET'])
def process_user_text_input():
    print(request.method)
    if request.method == 'POST':
        print(request.files)
        if 'fileName' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['fileName']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            if (".txt" in filename):
                with open(_path + filename) as f:
                    text = ""
                    for i in f.readlines():
                        text += i + ". "

                    payload = {"text": text}
            flash('File uploaded successfully.')
            print(jsonify({"success": "File uploaded successfully 200."}))

        response = requests.get(f"http://127.0.0.1:8080/graph_object_from_file/", params = payload)
        return response.content

    return '''
    <!doctype html>
    <title>Upload File</title>
    <h1>Upload File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route("/graph_object_from_file/", methods = ['GET'])
def process_graph_object_from_file():
    text = request.args.get("text")
    text_sentences = data_preprocess(text)
    print(">> ", text_sentences)
    for sentence in text_sentences:
        if (sentence == ""):
            raise HTTPException(status_code=404, detail="Sentence cannot be null.")
        create_new_node(sentence, None, graph)

    # summary = co.summarize(text = ' '.join(text_sentences))
    # keyword = generate_keyword_from_sentence(summary.summary)
    # graph.get_node(0).set_keyword(keyword)
    # graph.get_node(0).set_payload(summary.summary)
    return graph.to_json()

@app.route("/reset_graph", methods = ['GET'])
def reset_graph():
    graph = Graph()
    return graph.to_json()

if __name__ == "__main__":
	app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))


