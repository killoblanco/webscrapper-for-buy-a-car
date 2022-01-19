import json
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/')


def get_dir_content_list(directory):
    return os.listdir(directory)


def load_file_data(file_path):
    with open(file_path, 'r') as file:
        data = file.read()
    return data


def add_csv_header_from_dict(csv_data, header_dict):
    csv_data.insert(0, [key for key in header_dict if key != 'city'])


def parse_json_to_csv(json_data):
    json_data = json.loads(json_data)
    csv_data = []
    add_csv_header_from_dict(csv_data, json_data[0])
    for item in json_data:
        if not item:
            continue
        if len(item) > 14:
            continue
        if item['price'] is None or item['year'] is None or item['km'] is None:
            continue
        if (
            (item['brand'] is not None and item['model'] is not None) and (
            str('kicks') in item['brand'].lower() or
            str('kicks' or 'exclusive') in item['model'].lower()
        )):
            csv_data.append(
                [str(item[key]).replace(',', ' ').replace('.', '') if item[key] else '' for key in
                 item
                 if key != 'city']
            )
    return csv_data


def write_csv_data_list_to_file(csv_data, file_path):
    with open(file_path, 'w') as file:
        for line in csv_data:
            file.write(','.join(line) + '\n')


if __name__ == '__main__':
    data_files = get_dir_content_list(DATA_PATH)
    csv_data = []
    for file in data_files:
        if file.endswith('.json'):
            data = load_file_data(os.path.join(DATA_PATH, file))
            csv_data.extend(parse_json_to_csv(data))
    write_csv_data_list_to_file(csv_data, os.path.join(DATA_PATH, 'data.csv'))

    # df keep only brand and model columns if both contain 'kicks' no case sensitive
    # df = df[df['brand'].str.contains('kicks') | df['model'].str.contains('kicks')]
    # df = df[df['brand'].str.contains('kicks', case=False) | df['model'].str.contains('kicks',
    # case=False)]
