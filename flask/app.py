from flask import Flask, render_template, request, jsonify
import json  # to receive the data and transfer the data into the format that we need
import pymongo
import copy  # for copy operation
import time
import csv
from flask_cors import CORS, cross_origin
from pymongo import MongoClient  # working with PyMongo
from itertools import groupby


app = Flask(__name__)
CORS(app)

# insert the information of the new device to the collection candidateServer
# to get the data from the front end and initialize some attributes(i.e. actualPowerLoad,
# actualTemperature, startPosition, endPosition, onCabinet, on)
# transfer the data into the json format
# return 'success' when succeed


@app.route('/insertdevice', methods=['POST'])
def insertDevice():
    serverNumbering = request.form.get("Numbering")
    #cabinetNumbering = request.form.get("cabinetnumbering")
    height = request.form.get("height")
    category = request.form.get("category")
    responsible = request.form.get("responsible")
    ratedPower = request.form.get("ratedpower")
    thresholdTemperature = request.form.get("thresholdtemperature")
    cabinetNumbering = str(-1)
    actualPowerLoad = str(0)
    actualTemperature = str(0)
    startPosition = str(0)
    endPosition = str(0)
    onCabinet = str(0)
    on = str(0)

    serverNumber = str(serverNumbering)
    client = MongoClient()
    db = client.IDCs
    collection = db.server
    cursor = collection.find()
    for record in cursor:
        if serverNumber == record["Numbering"]:
            status = {
                'status': 'fail'
            }
            return jsonify(status)

    mydata = {}
    mydata["Numbering"] = str(serverNumbering)
    mydata["cabinetNumbering"] = str(cabinetNumbering)
    mydata["startPosition"] = str(startPosition)
    mydata["endPosition"] = str(endPosition)
    mydata["height"] = str(height)
    mydata["category"] = str(category)
    mydata["responsible"] = str(responsible)
    mydata["ratedPower"] = str(ratedPower)
    mydata["actualPowerLoad"] = str(actualPowerLoad)
    mydata["actualTemperature"] = str(actualTemperature)
    mydata["thresholdTemperature"] = str(thresholdTemperature)
    mydata["onCabinet"] = str(onCabinet)
    mydata["on"] = str(on)

    client = MongoClient()
    db = client.IDCs
    collection = db.server
    collection.insert_one(mydata)
    status = {
        'status': 'success'
    }
    return jsonify(status)


# insert the information of the new frame to the collection candidateServer
# return 'success' when succeed
@app.route('/insertframe', methods=['POST'])
def insertFrame():
    form = request.form
    frameNo = form.get("frameNo")
    cabinetNo = form.get("cabinetNo")
    location = form.get("location")
    deviceHeight = form.get("deviceHeight")
    deviceType = form.get("deviceType")
    brand = form.get("brand")
    typeSpec = form.get("typeSpec")
    unitNumber = form.get("unitNumber")
    systemName = form.get("systemName")
    functionPart = form.get("functionPart")
    section = form.get("section")
    officer = form.get("officer")
    contaction = form.get("contaction")

    mydata = {}
    mydata["frameNo"] = frameNo
    mydata["cabinetNo"] = cabinetNo
    mydata["location"] = location
    mydata["deviceHeight"] = deviceHeight
    mydata["deviceType"] = deviceType
    mydata["brand"] = brand
    mydata["typeSpec"] = typeSpec
    mydata["unitNumber"] = unitNumber
    mydata["systemName"] = systemName
    mydata["functionPart"] = functionPart
    mydata["section"] = section
    mydata["officer"] = officer
    mydata["contaction"] = contaction

    client = MongoClient()
    db = client.IDCs
    collection = db.server
    collection.insert_one(mydata)
    return 'success'


# insert the information of the new module to the collection candidateServer
# return 'success' when succeed
@app.route('/insertmodule', methods=['POST'])
def insertModule():
    form = request.form
    unitNo = form.get("unitNo")
    frameNo = form.get("frameNo")
    brand = form.get("brand")
    typeSpec = form.get("typeSpec")

    mydata = {}
    mydata["unitNo"] = unitNo
    mydata["frameNo"] = frameNo
    mydata["brand"] = brand
    mydata["typeSpec"] = typeSpec

    client = MongoClient()
    db = client.IDCs
    collection = db.server
    collection.insert_one(mydata)
    return 'success'


# delete one device with device number
# return 'success' when succeed
@app.route('/deletedevice', methods=['POST'])
def deleteServer():
    # serverNumbering = request.form.get("deviceNo")
    serverNumbering = request.get_json()['deviceNo']
    num = str(serverNumbering)
    client = MongoClient()
    db = client.IDCs
    db.server.delete_one({'Numbering': num})
    status = {
        'status': 'success'
    }
    return jsonify(status)


# reset the threshold value with cabinet number
# return 'success' when succeed
@app.route('/setthresholdvalue', methods=['POST'])
def setthreshold():
    cabinetNumbering = request.form.get("cabinetNumbering")
    thresholdPower = request.form.get("thresholdPower")
    num = str(cabinetNumbering)
    client = MongoClient()
    db = client.IDCs
    db.Cabinet.update(
        {"Numbering": num},
        {"$set":
            {
                "thresholdPowerLoad": thresholdPower
            }
         }
    )
    status = {
        'status': 'success'
    }
    return jsonify(status)


# return the information of all devices in JSON
@app.route('/getalldevice', methods=['GET'])
def searchServer():
    client = MongoClient()
    db = client.IDCs
    collection = db.server
    cursor = collection.find()
    resultlist = {}
    for record in cursor:
        serverNumber = int(record["Numbering"])
        resultlist[str(serverNumber)] = {
            "Numbering": record["Numbering"],
            "cabinetNumbering": record["cabinetNumbering"],
            "startPosition": record["startPosition"],
            "endPosition": record["endPosition"],
            "height": record["height"],
            "responsible": record["responsible"],
            "ratedPower": record["ratedPower"],
            "actualPowerLoad": record["actualPowerLoad"],
            "actualTemperature": record["actualTemperature"],
            "thresholdTemperature": record["thresholdTemperature"],
            "category": record["category"],
            "onCabinet": record["onCabinet"],
            "on": record["on"]
        }
    jsonStr = json.dumps(resultlist)
    return jsonStr


# return the information of all cabinets in JSON
@app.route('/getallcabinet', methods=['GET'])
def searchCabinet():
    client = MongoClient()
    db = client.IDCs
    collection = db.Cabinet
    cursor = collection.find()
    resultlist = {}
    for record in cursor:
        cabinetNumber = int(record["Numbering"])
        resultlist[str(cabinetNumber)] = {
            "cabinetNumbering": record["Numbering"],
            "serverRoomTitle": record["serverRoomTitle"],
            "responsible": record["responsible"],
            "category": record["category"],
            "startDate": record["startDate"],
            "cabinetSize": record["cabinetSize"],
            "NumberingPowerCabinet": record["NumberingPowerCabinet"],
            "actualTotalPowerLoad": record["actualTotalPowerLoad"],
            "thresholdPowerLoad": record["thresholdPowerLoad"],
            "actualTemperature": record["actualTemperature"],
            "thresholdCoolingLoad": record["thresholdCoolingLoad"],
            "uNumber": record["uNumber"]
        }
    jsonStr = json.dumps(resultlist)
    return jsonStr


# to change the "on/off" status of the server
# when service number is 1, to turn on the server with server number
# when service number is 2, to turn off the server with server number
# return 'success' when succeed
@app.route('/onandoff', methods=['POST'])
def serverOn():
    data = request.get_json()
    serverNumbering = data["serverNumbering"]
    on_or_off = data["onOrOff"]

    client = MongoClient()
    db = client.IDCs
    if on_or_off == 'on':
        serverNumbering = str(serverNumbering)

        maximumPower = db.server.find({"Numbering": serverNumbering}, {
                                      "ratedPower": 1, "_id": 0})  # to find the ratedPower for this particular server
        for record in maximumPower:
            power = int(record['ratedPower'])

        # to find the ratedPower for this particular server
        onCabinet = db.server.find({"Numbering": serverNumbering}, {
                                   "onCabinet": 1, "_id": 0})
        for record in onCabinet:
            cabinet = int(record['onCabinet'])

        if cabinet == -1 or cabinet == -2:
            status = {
                'status': 'reviewing'
            }
            return jsonify(status)

        if cabinet == 0:
            status = {
                'status': 'onfalse'
            }
            return jsonify(status)

        cabinetNumber = db.server.find({"Numbering": serverNumbering}, {
                                       "cabinetNumbering": 1, "_id": 0})  # to find the cabinet of this server
        for record in cabinetNumber:
            CabinetNumber = record['cabinetNumbering']

        # to find the actual power and threshold power of this cabinet
        cabinetActualPower = db.Cabinet.find({"Numbering": CabinetNumber}, {
                                             "actualTotalPowerLoad": 1, "_id": 0})
        for record in cabinetActualPower:
            ActualPower = record['actualTotalPowerLoad']

        cabinetThresholdPower = db.Cabinet.find({"Numbering": CabinetNumber}, {
                                                "thresholdPowerLoad": 1, "_id": 0})
        for record in cabinetThresholdPower:
            ThresholdPower = record['thresholdPowerLoad']

        # powercabinet = db.Cabinet.find({"Numbering":CabinetNumber},{"NumberingPowerCabinet":1,"_id":0}) # to find the actual power and threshold power of this cabinet
        # for record in powercabinet:
            # powerCabinetNumber = record['NumberingPowerCabinet']

        # powerCabinetThresholdPower = db.powerCabinet.find({"Numbering":powerCabinetNumber},{"thresholdPowerLoad":1,"_id":0})
        # for record in powerCabinetThresholdPower:
            # CabinetThresholdPower = record['thresholdPowerLoad']

        # powerCabinetActualPower = db.powerCabinet.find({"Numbering":powerCabinetNumber},{"actualTotalPowerLoad":1,"_id":0})
        # for record in powerCabinetActualPower:
            # CabinetActualPower = record['actualTotalPowerLoad']

        if (power + ActualPower) > ThresholdPower:
            status = {
                'status': 'fail'
            }
            return jsonify(status)

        db.server.update(
            {"Numbering": serverNumbering},
            {"$set":
                {
                    "on": str(-1)
                }
             }
        )
        status = {
            'status': 'success'
        }
        return jsonify(status)

    else:
        serverNumbering = str(serverNumbering)
        on = db.server.find({"Numbering": serverNumbering}, {
                            "on": 1, "_id": 0})
        for record in on:
            On = int(record['on'])

        if On == -1 or On == -2:
            db.server.update(
                {"Numbering": serverNumbering},
                {"$set":
                    {
                        "actualPowerLoad": str(0),
                        "actualTemperature": str(0),
                        "on": str(0)
                    }
                }
            )
            status = {
                'status': 'reviewing'
            }
            return jsonify(status)

        if On == 0:
            status = {
                'status': 'onfalse'
            }
            return jsonify(status)

        serverNumbering = str(serverNumbering)
        db.server.update(
            {"Numbering": serverNumbering},
            {"$set":
                {
                    "on": str(-2)
                }
             }
        )
        status = {
            'status': 'success'
        }
        return jsonify(status)


# to fetch the server from the cabinet
@app.route('/offcabinet', methods=['POST'])
def serverOffCabinet():
    serverNumbering = request.form["serverNumbering"]
    client = MongoClient()
    db = client.IDCs
    serverNumbering = str(serverNumbering)

    onCabinet = db.server.find({"Numbering": serverNumbering}, {
                               "onCabinet": 1, "_id": 0})
    for record in onCabinet:
        cabinet = int(record['onCabinet'])

    if cabinet == -1 or cabinet == -2:
        db.server.update(
            {"Numbering": serverNumbering},
            {"$set":
                {
                    "actualPowerLoad": str(0),
                    "actualTemperature": str(0),
                    "cabinetNumbering": str(-1),
                    "startPosition": str(0),
                    "endPosition": str(0),
                    "on": str(0),
                    "onCabinet": str(0)
                }
            }
        )
        status = {
            'status': 'reviewing'
        }
        return jsonify(status)

    if cabinet == 0:
        status = {
            'status': 'onfalse'
        }
        return jsonify(status)

    db.server.update(
        {"Numbering": serverNumbering},
        {"$set":
            {
                "onCabinet": str(-2),
            }
        }
    )
    status = {
        'status': 'success'
    }
    return jsonify(status)


# find possible place where this server can be put in
@app.route('/findposition', methods=['GET'])
def find_position():
    serverNumbering = request.args.get("serverNumbering")
    client = MongoClient()
    db = client.IDCs
    serverNumbering = str(serverNumbering)
    maximumPower = db.server.find({"Numbering": serverNumbering}, {
                                  "ratedPower": 1, "_id": 0})
    maximumHeight = db.server.find(
        {"Numbering": serverNumbering}, {"height": 1, "_id": 0})
    for record in maximumPower:
        power = int(record['ratedPower'])
    for record in maximumHeight:
        height = int(record['height'])

    candidatePlace = find_candidate_position(power, height)
    jsonStr = json.dumps(candidatePlace)
    return jsonStr


@app.route('/find_position_by_power_height', methods=['GET'])
def find_position_by_power_height():
    power = request.args.get('power')
    height = request.args.get('height')
    if power:
        power = int(power)
    if height:
        height = int(height)

    candidatePlace = find_candidate_place(power, height)
    jsonStr = json.dumps(candidatePlace)
    return jsonStr


def find_candidate_position(power, height):
    candidatePlace = {}
    client = MongoClient()
    db = client.IDCs
    cabinet = db.Cabinet.find()
    for record in cabinet:
        cabinetNumbering = record["Numbering"]
        cabinetUnumber = record["uNumber"]
        cabinetActualPower = record["actualTotalPowerLoad"]
        cabinetThresholdPower = record["thresholdPowerLoad"]
        initial_value = 0
        list_length = int(cabinetUnumber)
        current_usage = [initial_value for i in range(list_length)]

        servers = db.server.find()
        for server in servers:
            # print server
            if server["cabinetNumbering"] == cabinetNumbering:
                start = int(server["startPosition"])
                end = int(server["endPosition"])
                pos = start - 1
                while pos < end:
                    current_usage[pos] = int(server["onCabinet"])
                    pos += 1

        possible_choises = []
        cabinet_index = 1
        for i, j in groupby(current_usage):
            group = list(j)
            if group[0] == 0:
                possible_choises.append(
                    [cabinet_index, len(group) + cabinet_index - i - 1])
            cabinet_index += len(group)

        position = []
        for i, value in enumerate(possible_choises):
            if height <= value[1] - value[0] + 1 and (power + cabinetActualPower) < cabinetThresholdPower:
                position.append(value)

        candidatePlace[str(cabinetNumbering)] = {
            "cabinetNumbering": str(cabinetNumbering),
            "position": position
        }

    return candidatePlace


def find_candidate_place(power, height):
    candidatePlace = {}
    client = MongoClient()
    db = client.IDCs
    cursor = db.Cabinet.find()
    for record in cursor:
        cabinetNumbering = record["Numbering"]
        cabinetUnumber = record["uNumber"]
        cabinetActualPower = record["actualTotalPowerLoad"]
        cabinetThresholdPower = record["thresholdPowerLoad"]
        initial_value = 0
        list_length = int(cabinetUnumber)
        current_usage = [initial_value for i in range(list_length)]

        possible_choises = [initial_value for i in range(list_length)]
        cursor = db.server.find()
        for record in cursor:
            if record["cabinetNumbering"] == cabinetNumbering:
                start = int(record["startPosition"])
                end = int(record["endPosition"])
                pos = start - 1
                while pos < end:
                    current_usage[pos] = int(record["onCabinet"])
                    pos += 1

        available_space_continues = False

        last_unavailable_pos = 0

        for i, x in enumerate(current_usage):
            if x == 0:
                possible_choises[i] += 1
                if available_space_continues:
                    for j in range(last_unavailable_pos + 1, i):
                        possible_choises[j] += 1

                else:
                    available_space_continues = True

            else:
                last_unavailable_pos = i
                available_space_continues = False

        i = 0
        find_position = False
        while i < len(possible_choises):
            if height > possible_choises[i] or (power + cabinetActualPower) > cabinetThresholdPower:
                i += 1
                continue
            else:
                startPos = i + 1
                endPos = i + height
                candidatePlace[str(cabinetNumbering)] = {
                    "cabinetNumbering": str(cabinetNumbering),
                    "startPosition": str(startPos),
                    "endPosition": str(endPos)
                }
                break
    return candidatePlace


# to set the server on the cabinet
@app.route('/oncabinet', methods=['POST'])
def serverOnCabinet():
    serverNumbering = request.form["serverNumbering"]
    cabinetNumber = request.form["cabinetNumber"]
    startPosition = request.form["startPosition"]
    endPosition = request.form["endPosition"]

    client = MongoClient()
    db = client.IDCs
    serverNumbering = str(serverNumbering)
    db.server.update(
        {"Numbering": serverNumbering},
        {"$set":
            {
                "cabinetNumbering": str(cabinetNumber),
                "startPosition": str(startPosition),
                "endPosition": str(endPosition),
                "onCabinet": str(-1)
            }
         }
    )
    status = {
        'status': 'success'
    }
    return jsonify(status)


@app.route('/review_on_cabinet', methods=["POST"])
def review_on_cabinet():
    serverNumbering = request.form["serverNumbering"]
    on_cabinet = request.form['onCabinet']
    status = request.form["status"]
    update = {}
    if on_cabinet == '-1':
        if status == 'ship':
            update = {
                "onCabinet": str(1)
            }
        else:
            update = {
                "actualPowerLoad": str(0),
                "actualTemperature": str(0),
                "cabinetNumbering": str(-1),
                "startPosition": str(0),
                "endPosition": str(0),
                "on": str(0),
                "onCabinet": str(0)
            }
    elif on_cabinet == '-2':
        if status == 'ship':
            update = {
                "actualPowerLoad": str(0),
                "actualTemperature": str(0),
                "cabinetNumbering": str(-1),
                "startPosition": str(0),
                "endPosition": str(0),
                "on": str(0),
                "onCabinet": str(0)
            }
        else:
            update = {
                "onCabinet": str(1)
            }

    client = MongoClient()
    db = client.IDCs
    serverNumbering = str(serverNumbering)
    db.server.update(
        {"Numbering": serverNumbering},
        {"$set": update}
    )
    status = {
        'status': 'success'
    }
    return jsonify(status)


@app.route('/review_on', methods=["POST"])
def review_on():
    serverNumbering = request.form["serverNumbering"]
    status = request.form["status"]
    on = request.form["on"]

    update = {}
    if on == '-1':
        if status == 'ship':
            update = {
                "on": "1"
            }
        else:
            update = {
                "on": "0",
                "actualPowerLoad": "0",
                "actualTemperature": "0",
            }
    elif on == '-2':
        if status == 'ship':
            update = {
                "on": "0",
                "actualPowerLoad": "0",
                "actualTemperature": "0",
            }
        else:
            update = {
                "on": "1"
            }
    client = MongoClient()
    db = client.IDCs
    serverNumbering = str(serverNumbering)
    db.server.update(
        {"Numbering": serverNumbering},
        {"$set": update}
    )
    status = {
        'status': 'success'
    }
    return jsonify(status)


if __name__ == '__main__':
    app.run(debug=True)
