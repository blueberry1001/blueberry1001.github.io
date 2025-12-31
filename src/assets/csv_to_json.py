import csv
import json

INPUT = "thinkers.csv"
OUTPUT = "temp/thinkers.json"

LIST_FIELDS = {"books","description"}
INT_FIELDS = {"exam_priority"}

key_list = ["id","name","books","religion","era","region"]
listkey_key = ["books","description"]

def csv_to_json():
    result = []

    with open(INPUT, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            item = {}

            for key in key_list:
                if key not in row:
                    item[key] = ""
            
            for key in listkey_key:
                if key not in row:
                    item[key] = []

            for key, val in row.items():
                val = val.strip()
                if key in LIST_FIELDS:
                    if val == "":
                        item[key] = []
                    else:
                        item[key] = [x.strip() for x in val.split(";")]
                elif key in INT_FIELDS:
                    item[key] = int(val)
                else:
                    item[key] = val

            result.append(item)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    csv_to_json()
    print("Done")