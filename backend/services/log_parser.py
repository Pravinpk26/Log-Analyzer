import json
import csv


def parse_json_log(file_path):

    events = []

    with open(file_path, "r") as file:

        data = json.load(file)

        for event in data:

            events.append(event)

    return events


def parse_csv_log(file_path):

    events = []

    with open(file_path, newline="") as file:

        reader = csv.DictReader(file)

        for row in reader:

            events.append(row)

    return events


def parse_log_file(file_path):

    if file_path.endswith(".json"):

        return parse_json_log(file_path)

    elif file_path.endswith(".csv"):

        return parse_csv_log(file_path)

    else:

        raise Exception(
            "Unsupported log format."
        )