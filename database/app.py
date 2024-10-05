from flask import Flask, jsonify, request
from pymongo import MongoClient

import json

from configs.siloing_data_config import dummy_siloing_data

app = Flask(__name__)

client = MongoClient('localhost', 27017)


@app.route("/fetch_siloing_data", methods=['GET'])
def fetch_siloing_data():
    database_data = siloing_data.find()
    result = []
    for data in database_data:
        result.append({'token_id': data['token_id'], 'platform': data['platform'], 'time': data['time']})
    return jsonify(result)

@app.route('/add_siloing_data', methods=['POST'])
def add_siliong_data():
    data = request.get_json()
    
    try:
        siloing_data.insert_one(data)
    except: 
        return "Error in saving data", 500
    else:
        return 'Data saved', 201


db = client.healthy_ui

# drop table on save/start of program -> remove this when production ready
db.siloing_data.drop()

# read json schema file and add it as validator
with open("schemas/siloing_data_schema.json", "r") as file:
    json_validator = json.load(file)

db.create_collection('siloing_data', validator={'$jsonSchema': json_validator})


siloing_data = db.siloing_data

if __name__ == "__main__":
    app.run(debug=True)
