
import json
import csv

if __name__ == "__main__":

    data = []
    with open("sample_data.csv", mode="r", encoding="utf-8-sig") as csv_file:
        reader = csv.DictReader(csv_file, delimiter=";")
        for row in reader:
            data.append(row)
    with open('sievo_spend_data_preprocessed.json', 'w', encoding="utf-8-sig") as f:
        json.dump(data , f)