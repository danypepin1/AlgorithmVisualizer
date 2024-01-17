from flask import Flask, jsonify
from data import convert_graph_to_json, create_graph, fetch_osm_data
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/graph/<city_name>')
def get_graph(city_name):
    data = fetch_osm_data(city_name)
    graph = create_graph(data)

    graph_data = convert_graph_to_json(graph)
    return jsonify(graph_data)

if __name__ == '__main__':
    app.run(debug=True)
