#import files
from pre_process import data_preprocess
from structure import Node, Graph, Autocomplete

# Import Relavent Libraries:
import json
import random
import math
import numpy as np
import os
import cohere
import string
import openai
from dotenv import load_dotenv
load_dotenv()
#define API Key and cohere client
# API_KEY = "jzTXmIbUCjmvuESOO1eFo9FMlA5zRFPe5XH1UUDY"
co = cohere.Client(os.getenv('COHERE_API_KEY'))

#define Open AI Key and Client
# OPENAI_API_KEY = "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"
openai.api_key = os.getenv('OPENAI_API_KEY')

#global_constants
CONNECT_ROOT_TO_HEAD = 0.5
NODE_TOO_SIMILAR_TO_ANOTHER = 0.9

#Testing-Arjun

test_string = """
I need you to help me build a knowledge graph. I have some text from a presentation, and I want you to map that out from a basic idea (the root node) to more specific things about this idea. I also want you to assume the person who wrote this text isn't fully informed, so you must insert your own ideas into this as you please. Give me a graph representation in text form. Here is the text:

Okay, so I was thinking about this hackathon idea to help people keep their attention. You know how it's so hard to stay focused nowadays with all the distractions around us? Well, I was thinking about creating an app that uses gamification to keep people engaged. Like, maybe we could have different levels where users have to complete certain tasks or challenges to progress. And the tasks could be related to things like productivity or mindfulness. For example, completing a certain number of Pomodoros could move you up a level, or doing a guided meditation could give you bonus points. We could also incorporate social accountability, so users can compete with friends or colleagues and see each other's progress. I think it could be really helpful for people who struggle with staying on task, and it could be a fun way to make productivity more enjoyable. What do you think?
"""

test_sentences = data_preprocess(test_string)

def create_embedding(text):
  text[0] = text[0].replace("/n", "")
  return co.embed(text, model = "small").embeddings[0]

def calculate_similarity(node_a, node_b):
    if (node_a is None or node_b is None):
        return 0;
    return np.dot(node_a, node_b) / (np.linalg.norm(node_a) * np.linalg.norm(node_b))

def generate_keyword_from_sentence(sentence: str):
  prompt = """
    Extract a descriptive keyword that gives the core idea of a sentence. Here is the sentence:
  
    """ + sentence + ". Keyword: \n"
#   response = co.generate(prompt, model = "xlarge", 
#         max_tokens=10,
#         temperature=0.2,
#         frequency_penalty=0.8,
#         presence_penalty=0.0,
#         p = 0
# ).generations[0].text
#   return response

  response = openai.Completion.create(engine="text-davinci-003",prompt=prompt)
  return response['choices'][0]['text']

# Testing:
x = Node("1AJX3s", "What is this shit I'm feeling", "Feeling Shit", ["1AXCc3"], ["6TrQaz", "Ll12Az"], 2, 12.3, [0.2]*1024, 134, 34, False)
# print(x.to_json())

test_graph = Graph()
test_graph.create_node("1AJX3s", "What is this shit I'm feeling", "Feeling Shit", ["1AXCc3"], ["6TrQaz", "Ll12Az"], 2, 12.3, [0.2]*1024, 134, 34, False)

# print(">> ", y.get_node("1AJX3s").to_json())
test_graph.get_node("1AJX3s").set_x_coord(69.69)
# print(">> ", y.get_node("1AJX3s").to_json())

#autocomplete gives the parent node of the id that needs to be autocompleted.
def create_new_node(sentence: str, autocomplete: Autocomplete, graph: Graph):
    #embedding for new node
    new_embedding = create_embedding([sentence])
    # print(len(new_embedding))

    #barring the root node check every node
    for node in graph.get_nodes_values():
        node_embedding = node.get_embedding()
        if (len(node_embedding) != 0):
            if (calculate_similarity(new_embedding, node_embedding) > NODE_TOO_SIMILAR_TO_ANOTHER):
                print("Too similar a node aldready exists!")
                return
        
    max_similarity = 0
    max_node_id = 0 #parent node id

    if (autocomplete is None):
        #loop through all the nodes to check which node is most similar to - define parent node
        for node in graph.get_nodes_values():
            node_embedding = node.get_embedding()
            if (len(node_embedding) != 0):
                similarity = calculate_similarity(new_embedding, node_embedding)
                if (similarity > max_similarity and similarity > CONNECT_ROOT_TO_HEAD):
                    max_similarity = similarity
                    max_node_id = node.get_id()

        #make sure id is unique
        new_node_id = ''.join(random.choices(string.ascii_lowercase, k=5))
        while (new_node_id in graph.get_nodes_ids()):
            new_node_id = ''.join(random.choices(string.ascii_lowercase, k=5))

        #generate a descriptive keyword for the sentence - Cohere generation API
        keyword = generate_keyword_from_sentence(sentence)

        #get depth of parent node
        parent_node_depth = graph.get_node(max_node_id).get_depth()

        #add to the children of the parent node
        graph.get_node(max_node_id).add_child(new_node_id)

        if (max_similarity != 0 and max_node_id != 0):
            print("creating a new node that's attached to parent node with id: " + str(max_node_id))
            
        graph.create_node(new_node_id, sentence, keyword, [max_node_id],
        [],parent_node_depth + 1, 0, new_embedding, 0, 0, False)

    else:
        # THE FOLLOWING CODE IS SIMILAR TO THE ABOVE CODE? CAN THINKING OF OPTIMIZATIONS?

        #make sure id is unique
        new_node_id = ''.join(random.choices(string.ascii_lowercase, k=5))
        while (new_node_id in graph.get_nodes_ids()):
            new_node_id = ''.join(random.choices(string.ascii_lowercase, k=5))

        #generate a descriptive keyword for the sentence - Cohere generation API
        keyword = generate_keyword_from_sentence(sentence) + " AUTOCOMPLETED!"

        #get depth of parent node
        parent_node_depth = graph.get_node(autocomplete.get_parent()).get_depth()

        #add to the children of the parent node
        graph.get_node(autocomplete.get_parent()).add_child(new_node_id)

        graph.create_node(new_node_id, sentence, keyword, [autocomplete.get_parent()],
        [],parent_node_depth + 1, 0, new_embedding, 0, 0, True)


# print(test_graph.to_json())
# create_new_node(test_sentences[0], None, test_graph)
# print(test_graph.to_json())