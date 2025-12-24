import csv
import json

INPUT = "thinkers.csv"
OUTPUT = "temp/thinkers.json"

LIST_FIELDS = {"books","description"}
INT_FIELDS = {"exam_priority"}

def csv_to_json():
    result = []

    with open(INPUT, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            item = {}

            for key, val in row.items():
                val = val.strip()

                if val == "":
                    continue

                if key in LIST_FIELDS:
                    item[key] = [x.strip() for x in val.split(";")]
                elif key in INT_FIELDS:
                    item[key] = int(val)
                else:
                    item[key] = val

            # 最低限の検証
            if "name" not in item:
                raise ValueError("name is required")

            result.append(item)

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    csv_to_json()
