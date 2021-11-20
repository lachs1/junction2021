from collections import defaultdict
import json
import csv

if __name__ == "__main__":

    average_prices = defaultdict(dict)

    with open("sievo_spend_data.csv") as csv_file:
        reader = csv.DictReader(csv_file, delimiter=";")
        for row in reader:
            vendor = row["VendorName"]
            product = row["ProductName"]
            price = row["SpendEUR"]
            quantity = row["Quantity"]
            uom = row["UOM"]
            if not price or not product or not price or not quantity:
                continue

            price = float(price.replace(",", "."))
            quantity = float(quantity.replace(",", "."))

            if uom == "G":
                quantity = quantity / 1000

            key = (vendor, product)
            price_per_kg = price / quantity

            if key in average_prices:
                average_prices[key]["average_price"] += price_per_kg
                average_prices[key]["average_price"] /= 2
            else:
                average_prices[key]["average_price"] = price_per_kg
                average_prices[key]["document_id"] = row["DocumentId"]
                average_prices[key]["product_id"] = row["ProductId"]
                average_prices[key]["vendor_id"] = row["VendorId"]
                average_prices[key]["vendor_city"] = row["VendorCity"]
                average_prices[key]["vendor_country"] = row["VendorCountry"]
                average_prices[key]["category_L1"] = row["CategoryL1"]
                average_prices[key]["category_L2"] = row["CategoryL2"]
                average_prices[key]["vendor"] = vendor
                average_prices[key]["product"] = product

    data = []
    with open("sample_data.csv") as csv_file:
        reader = csv.DictReader(csv_file, delimiter=";")
        for row in reader:
            data.append(row)
    with open('sievo_spend_data_preprocessed.json', 'w') as f:
        json.dump(data , f)
    # data = []
    # for _, values in average_prices.items():
    #     data.append(values)
# 
    # with open('sievo_spend_data_preprocessed.json', 'w') as f:
    #     json.dump(data , f)
   # with open("sievo_spend_data_preprocessed.csv", "w", newline="") as csv_file:
   #     fieldnames = [
   #         "vendor",
   #         "product",
   #         "average_price",
   #         "document_id",
   #         "product_id",
   #         "vendor_id",
   #         "vendor_city",
   #         "vendor_country",
   #         "category_L1",
   #         "category_L2",
   #     ]
   #     writer = csv.DictWriter(csv_file, fieldnames=fieldnames, delimiter=";")
   #     writer.writeheader()
   #     for _, values in average_prices.items():
   #         writer.writerow(values)
