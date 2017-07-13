from flask import Flask, render_template, request, jsonify
import json # to receive the data and transfer the data into the format that we need
import pymongo
import copy # for copy operation
import time
import csv
from flask_cors import CORS, cross_origin
from pymongo import MongoClient #working with PyMongo


app = Flask(__name__)
CORS(app)

#insert the information of the new device to the collection candidateServer
#to get the data from the front end and initialize some attributes(i.e. actualPowerLoad,
#actualTemperature, startPosition, endPosition, onCabinet, on)
#transfer the data into the json format
#return 'success' when succeed
@app.route('/insertdevice', methods=['POST'])
def insertDevice():
    serverNumbering = request.form.get("Numbering") 
    cabinetNumbering = request.form.get("cabinetnumbering")
    height = request.form.get("height")
    category = request.form.get("category")
    responsible = request.form.get("responsible")
    ratedPower = request.form.get("ratedpower")
    thresholdTemperature = request.form.get("thresholdtemperature")
    actualPowerLoad = str(0)
    actualTemperature = str(0)
    startPosition = str(0)
    endPosition = str(0)
    onCabinet = str(0) 
    on = str(0) 

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
    return 'success'


#insert the information of the new frame to the collection candidateServer
#return 'success' when succeed
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


#insert the information of the new module to the collection candidateServer
#return 'success' when succeed
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


#delete one device with device number
#return 'success' when succeed
@app.route('/deletedevice', methods=['POST'])
def deleteServer():
    serverNumbering = request.form.get("deviceNo") 
    num = str(serverNumbering)
    client = MongoClient()
    db = client.IDCs 
    db.server.delete_one({'Numbering': num})
    return "success"


#reset the threshold value with cabinet number
#return 'success' when succeed
@app.route('/setthresholdvalue', methods=['POST'])
def setthreshold():
    cabinetNumbering = request.form.get("cabinetNumbering") 
    thresholdPower = request.form.get("thresholdPower")
    print cabinetNumbering
    print thresholdPower
    num = str(cabinetNumbering)
    client = MongoClient() 
    db = client.IDCs 
    db.Cabinet.update(
        { "Numbering": num }, 
        { "$set": 
            {
            "thresholdPowerLoad": thresholdPower
            }
        }
    )
    return "success"


#return the information of all devices in JSON
@app.route('/getalldevice', methods=['GET'])
def searchServer():
    client = MongoClient() 
    db = client.IDCs 
    collection = db.server 
    cursor=collection.find()
    resultlist={}
    for record in cursor:
        serverNumber = int(record["Numbering"])
        resultlist[str(serverNumber)] ={
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
            "onCabinet" : record["onCabinet"],
            "on" : record["on"]
        }
    jsonStr = json.dumps(resultlist)
    return jsonStr


#return the information of all cabinets in JSON
@app.route('/getallcabinet', methods=['GET'])
def searchCabinet():
    client = MongoClient() 
    db = client.IDCs
    collection = db.Cabinet 
    cursor=collection.find()
    resultlist={}
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


#to change the "on/off" status of the server
#when service number is 1, to turn on the server with server number
#when service number is 2, to turn off the server with server number
#return 'success' when succeed
@app.route('/onandoff', methods=['POST'])
def serverOn():

    serverNumbering = request.form["serverNumbering"]
    serviceNumber = request.form["serviceNumber"]

    client = MongoClient() 
    db = client.IDCs 

    if int(serviceNumber) == 1:
        serverNumbering = str(serverNumbering)
        maximumPower = db.server.find({"Numbering":serverNumbering},{"ratedPower":1,"_id":0}) 
        for record in maximumPower:
            power = int(record['ratedPower'])
        cabinetNumber = db.server.find({"Numbering":serverNumbering},{"cabinetNumbering":1,"_id":0}) 
        for record in cabinetNumber:
            CabinetNumber = record['cabinetNumbering']
        print(CabinetNumber)
        cabinetActualPower = db.Cabinet.find({"Numbering":CabinetNumber},{"actualTotalPowerLoad":1,"_id":0}) 
        for record in cabinetActualPower:
            ActualPower = record['actualTotalPowerLoad']
        cabinetThresholdPower = db.Cabinet.find({"Numbering":CabinetNumber},{"thresholdPowerLoad":1,"_id":0})
        for record in cabinetThresholdPower:
            ThresholdPower = record['thresholdPowerLoad']
        powercabinet = db.Cabinet.find({"Numbering":CabinetNumber},{"NumberingPowerCabinet":1,"_id":0})
        for record in powercabinet:
            powerCabinetNumber = record['NumberingPowerCabinet']
        powerCabinetThresholdPower = db.powerCabinet.find({"Numbering":powerCabinetNumber},{"thresholdPowerLoad":1,"_id":0})
        for record in powerCabinetThresholdPower:
            CabinetThresholdPower = record['thresholdPowerLoad']
        powerCabinetActualPower = db.powerCabinet.find({"Numbering":powerCabinetNumber},{"actualTotalPowerLoad":1,"_id":0})
        for record in powerCabinetActualPower:
            CabinetActualPower = record['actualTotalPowerLoad']
        if (power+ActualPower) > ThresholdPower or (power+CabinetActualPower) > CabinetThresholdPower:
            return("false")
        else:
            db.server.update(
                { "Numbering": serverNumbering }, 
                { "$set": 
                    {
                    "on": str(1)
                    }
                }
            )
            return("success")

    else:
        serverNumbering = str(serverNumbering)
        db.server.update(
            { "Numbering": serverNumbering }, 
            { "$set": 
                {
                "actualPowerLoad":str(0),
                "actualTemperature":str(0),
                "on": str(0)
                }
            }
        )
        return "success"

# to fetch the server from the cabinet
@app.route('/offcabinet', methods=['POST'])
def serverOffCabinet():
    serverNumbering = request.form["serverNumbering"] 
    client = MongoClient() 
    db = client.IDCs 
    serverNumbering = str(serverNumbering)
    db.server.update( 
        { "Numbering": serverNumbering },
        { "$set":
            {
            "actualPowerLoad":str(0),
            "actualTemperature":str(0),
            "cabinetNumbering":str(-1),
            "startPosition": str(0),
            "endPosition": str(0),
            "onCabinet": str(0),
            "on": str(0)
            }
        }
    )
    return "success"

# find possible place where this server can be put in
@app.route('/findposition', methods=['POST'])
def find_position():
    serverNumbering = request.form.get("serverNumbering") 
    client = MongoClient() 
    db = client.IDCs 
    candidatePlace = {}
    serverNumbering = str(serverNumbering)
    maximumPower = db.server.find({"Numbering":serverNumbering},{"ratedPower":1,"_id":0})
    maximumHeight = db.server.find({"Numbering":serverNumbering},{"height":1,"_id":0})
    for record in maximumPower:
        power = int(record['ratedPower'])
    for record in maximumHeight:
        height = int(record['height'])
    cursor = db.Cabinet.find() 
    for record in cursor:
        cabinetNumbering = record["Numbering"]
        cabinetUnumber = record["uNumber"]
        cabinetActualPower = record["actualTotalPowerLoad"]
        cabinetThresholdPower = record["thresholdPowerLoad"]
        initial_value = 0
        list_length = int(cabinetUnumber)
        current_usage = [ initial_value for i in range(list_length)]
        # Possible Choices
        possible_choises = [ initial_value for i in range(list_length)]
        cursor = db.server.find()
        for record in cursor:
            if record["cabinetNumbering"] == cabinetNumbering :
                start = int(record["startPosition"])
                end = int(record["endPosition"])
                pos = start - 1
                while pos < end:
                    current_usage[pos] = 1
                    pos += 1
            # continues space
        available_space_continues = False

            # last unavailable position
        last_unavailable_pos = 0

        for i, x in enumerate(current_usage):
            if x == 0:
                    # available space
                possible_choises[i] += 1
                if available_space_continues:
                    for j in range(last_unavailable_pos+1, i):
                            # print j, i
                        possible_choises[j] += 1

                else:
                    available_space_continues = True
                        # available_space_continues = True
            else:
                last_unavailable_pos = i
                available_space_continues = False

        i = 0
        find_position = False
        while i < len(possible_choises):
            if height > possible_choises[i] or (power+cabinetActualPower) > cabinetThresholdPower:
                i += 1
                continue
            else:
                startPos = i+1
                endPos = i+height
                candidatePlace[str(cabinetNumbering)] = {
                    "cabinetNumbering": str(cabinetNumbering),
                    "startPosition" : str(startPos),
                    "endPosition" : str(endPos)
                }
                break
    jsonStr = json.dumps(candidatePlace)
    return jsonStr

# to set the server on the cabinet
@app.route('/oncabinet', methods=['POST'])
def serverOnCabinet():

    serverNumbering = request.form["serverNumbering"] 
    cabinetNumber = request.form["cabinetNumber"]
    startPosition = request.form["startPosition"]
    endPosition = request.form["endPosition"]

    client = MongoClient() #making a connection with MongoClient
    db = client.IDCs #getting a database of MongoDB
    serverNumbering = str(serverNumbering) 
    db.server.update( # to update the server state whether its on the cabinet
        { "Numbering": serverNumbering },
        { "$set":
            {
            "cabinetNumbering":str(cabinetNumber),
            "startPosition": str(startPosition),
            "endPosition": str(endPosition),
            "onCabinet": str(1)
            }
        }
    )
    return "success"


if __name__ == '__main__':
    app.run(debug=True)
