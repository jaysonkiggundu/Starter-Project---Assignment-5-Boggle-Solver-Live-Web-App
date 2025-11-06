import json

def read_json_to_list(file_path):
    """Read a JSON file that may be a list or dict, and return a flat list of words."""
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)

    # Handle both list and dict structures safely
    if isinstance(data, list):
        return data
    elif isinstance(data, dict):
        words = []
        for value in data.values():
            if isinstance(value, list):
                words.extend(value)
            else:
                words.append(value)
        return words
    else:
        raise ValueError("Unsupported JSON format: must be a list or dict")
