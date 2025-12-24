import json
import csv

INPUT = "thinkers.json"
OUTPUT = "thinkers.csv"

FIELDS = [
    "id",
    "name",
    "description",
    "books",
    "religion",
    "era",
    "region",
]

def json_to_csv():
    with open(INPUT, "r", encoding="utf-8") as f:
        data = json.load(f)

    with open(OUTPUT, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()

        for item in data:
            row = {}
            for key in FIELDS:
                val = item.get(key, "")
                if isinstance(val, list):
                    val = ";".join(val)
                row[key] = val
            writer.writerow(row)

if __name__ == "__main__":
    json_to_csv()
