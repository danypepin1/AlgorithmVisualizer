from flask import Flask, jsonify, Blueprint
import osmnx as ox

data_pb = Blueprint('data', __name__)
app = Flask(__name__)

@app.route('/', methods=["GET"])
def get_map_data():
    location = "New York, New York, USA"
    G = ox.graph_from_place(location, network_type='drive')
    gdf_edges = ox.graph_to_gdfs(G, nodes=False, edges=True)
    geojson_data = gdf_edges.to_json()
    result = jsonify(geojson_data)
    print(result)
    return result
