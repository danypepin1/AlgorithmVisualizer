import requests
import json
import networkx as nx
import folium

def fetch_osm_data(city_name):
    # Define the Overpass API query
    query = f"""
    [out:json];
    area[name="{city_name}"]->.searchArea;
    (
        node(area.searchArea)[highway];
        way(area.searchArea)[highway];
        relation(area.searchArea)[highway];
    );
    (._;>;);
    out body;
    """

    # URL of the Overpass API
    url = "http://overpass-api.de/api/interpreter"

    try:
        # Send the request to the Overpass API
        response = requests.get(url, params={'data': query})
        response.raise_for_status()  # Raise an exception for HTTP errors

        # Parse and return the JSON data
        return response.json()

    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return None
    

def save_to_file(data, filename):
    # Save the data to a file in JSON format
    try:
        with open(filename, 'w') as file:
            json.dump(data, file, indent=4)
        print(f"Data saved to {filename}")
    except IOError as e:
        print(f"Error saving file: {e}")

def load_osm_data(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)
    
def create_graph(osm_data):
    G = nx.Graph()
    node_count = 0
    edge_count = 0

    for element in osm_data['elements']:
        if element['type'] == 'node':
            lat = element.get('lat')
            lon = element.get('lon')
            if lat is not None and lon is not None:
                G.add_node(element['id'], pos=(lat, lon))
                node_count += 1
            else:
                print(f"Missing position data for node: {element['id']}")
        elif element['type'] == 'way':
            for i in range(len(element['nodes']) - 1):
                G.add_edge(element['nodes'][i], element['nodes'][i + 1])
                edge_count += 1

    print(f"Total nodes added: {node_count}")
    print(f"Total edges added: {edge_count}")
    return G

def plot_graph_on_map(graph):
    if nx.is_empty(graph):
        print("The graph is empty. No nodes were added.")
        return

    #map_osm = folium.Map(location=[0, 0], zoom_start=2)
    map_osm = folium.Map(location=[0, 0], zoom_start=2, tiles='CartoDB dark_matter')
    node_coords = []
    line_coords = []
     # Draw edges (streets)
    for edge in graph.edges():
        start_node = graph.nodes[edge[0]]
        end_node = graph.nodes[edge[1]]
        if 'pos' in start_node and 'pos' in end_node:
            start_pos = start_node['pos']
            end_pos = end_node['pos']
            line = [start_pos, end_pos]
            folium.PolyLine(line, color="orange", weight=1).add_to(map_osm)
            line_coords.extend(line)  # Add both start and end points of the line to the list

    """ # Draw edges (streets)
    for edge in graph.edges():
        start_node = graph.nodes[edge[0]]
        end_node = graph.nodes[edge[1]]
        if 'pos' in start_node and 'pos' in end_node:
            start_pos = start_node['pos']
            end_pos = end_node['pos']
            line = [start_pos, end_pos]
            folium.PolyLine(line, color="orange", weight=1).add_to(map_osm) """
    if line_coords:
        map_osm.fit_bounds(bounds=[line_coords])
    else:
        print("No edge coordinates found for mapping.")
        return
    # Draw nodes (intersections)
    """ for node, data in graph.nodes(data=True):
        pos = data.get('pos')
        if pos:
            node_coords.append([pos[0], pos[1]])
            folium.CircleMarker(location=[pos[0], pos[1]], radius=1, color='red').add_to(map_osm) """

    """ if node_coords:
        map_osm.fit_bounds(bounds=node_coords)
    else:
        print("No nodes with position data found in the graph.")
        return """
    map_osm.save('map.html')
# Save the map to an HTML file





def main():
    file_path = 'Charlesbourg_osm_data.json'
    osm_data = load_osm_data(file_path)
    graph = create_graph(osm_data)
    plot_graph_on_map(graph)
    print("Number of nodes:", graph.number_of_nodes())
    print("Number of edges:", graph.number_of_edges())

    """ city_name = input("Enter the name of the city: ")
    # Fetch data for the specified city
    osm_data = fetch_osm_data(city_name)

    if osm_data:
        filename = f"{city_name.replace(' ', '_')}_osm_data.json"
        save_to_file(osm_data, filename)
        print(osm_data) """

if __name__ == "__main__":
    main()