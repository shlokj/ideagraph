import json
import random
import math
import numpy as np

#Autocomplete Class
class Autocomplete:
    def __init__(self, response, parent_id):
        self.response = response
        self.parent_id = parent_id
    
    #Getters
    def get_response(self):
        return self.response
    
    def get_parent(self):
        return self.parent_id


# Node Class:
class Node:
    def __init__(self, id, payload, keyword, parents, children, depth, distance, embedding, x_coord, y_coord, autocompleted):
        self.id = id
        self.payload = payload
        self.keyword = keyword
        self.parents = parents
        self.children = children
        self.depth = depth
        self.distance = distance
        self.embedding = embedding
        self.x_coord = x_coord
        self.y_coord = y_coord
        self.autocompleted = autocompleted

    # Getters:
    def get_id(self):
        return self.id
    
    def get_payload(self):
        return self.payload
    
    def get_keyword(self):
        return self.keyword
    
    def get_parents(self):
        return self.parents
    
    def get_children(self):
        return self.children
    
    def get_depth(self):
        return self.depth
    
    def get_distance(self):
        return self.distance
    
    def get_embedding(self):
        return self.embedding
    
    def get_x_coord(self):
        return self.x_coord
    
    def get_y_coord(self):
        return self.y_coord
    
    def get_autocompleted(self):
        return self.autocompleted
    
    # Setters:
    def set_payload(self, payload):
        self.payload = payload
        
    def set_keyword(self, keyword):
        self.keyword = keyword
    
    def set_parents(self, parents):
        self.parents = parents
    
    def set_children(self, children):
        self.children = children
    
    def set_depth(self, depth):
        self.depth = depth
    
    def set_distance(self, distance):
        self.distance = distance
    
    def set_embedding(self, embedding):
        self.embedding = embedding
    
    def set_x_coord(self, x_coord):
        self.x_coord = x_coord
    
    def set_y_coord(self, y_coord):
        self.y_coord = y_coord
        
    # Helper methods:
    def add_parent(self, parent_node):
        self.parents.append(parent_node)
    
    def add_child(self, child_node):
        self.children.append(child_node)
    
    def remove_parent(self, parent_node):
        if parent_node in self.parents:
            self.parents.remove(parent_node)
    
    def remove_child(self, child_node):
        if child_node in self.children:
            self.children.remove(child_node)
    
    def is_leaf(self):
        return len(self.children) == 0
    
    def is_root(self):
        return len(self.parents) == 0
    
    def make_autocomplete(self):
        self.autocompleted = True

    # JSON converter:
    def to_dict(self):
        return {
            'id': self.id,
            'payload': self.payload,
            'keyword': self.keyword,
            'parents': self.parents,
            'children': self.children,
            'depth': self.depth,
            'distance': self.distance,
            'embedding': self.embedding,
            'x_coord': self.x_coord,
            'y_coord': self.y_coord,
            'autocompleted': self.autocompleted
        }
    
    def to_json(self):
        return json.dumps(self.to_dict())

    # NOTE: Can add simmilarity Function

# Graph Class:
class Graph:
    def __init__(self):
        self.node_dict = {}
        self.create_root_node()

    # Helper methods:
    def create_root_node(self):
        self.node_dict[0] = Node(0, "", "", [], [], 0, 0, [], 0, 0, False)

    def create_node(self, id, payload, keyword, parents, children, depth, distance, embedding, x_coord, y_coord, autocomplete):
        self.node_dict[id] = Node(id, payload, keyword, parents, children, depth, distance, embedding, x_coord, y_coord, autocomplete)

    def remove_node(self, node_id):
        self.node_dict.pop(node_id)

    def get_node(self, node_id):
        return self.node_dict[node_id]

    def get_nodes_ids(self):
        values = self.node_dict.values()
        ids = []
        for val in values:
            ids.append(val.id)
        return ids

    def get_nodes_values(self):
        return list(self.node_dict.values())

    @staticmethod
    def convert_node_format(node):
        data_dict = node.to_dict()
        formatted_data = {
            'id': str(data_dict['id']),
            'position': {
                'x': data_dict['x_coord'],
                'y': data_dict['y_coord']
            },
            "type": 'nodeContainer',
            'data': {
                'label': str(data_dict['keyword']),
                'sourceHandle': str(data_dict['id']),
                'payload': str(data_dict['payload'])
            }
        }
        return formatted_data
    
    def generate_edges(self):
        edges = []
        for node in self.node_dict.values():
            node_id = str(node.id)
            for child_id in node.children:
                edge_id = f"e{node_id}-{child_id}"
                edge = {
                    "id": edge_id,
                    "source": node_id,
                    "target": str(child_id),
                    "animated": self.get_node(child_id).get_autocompleted()
                }
                edges.append(edge)
        return edges

    def get_nodes_with_keyword_payload(self):
        return [{node.id: [node.keyword, node.payload]} for node in self.get_nodes_values()]

    def to_json(self):
        return {
            "nodes": [self.convert_node_format(node) for node in self.node_dict.values()],
            "nodes_data": self.get_nodes_with_keyword_payload(),
            "edges": self.generate_edges()
        }
