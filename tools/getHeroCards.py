# run in marvelsdb-json-data

import os, json

# open every json in pack folder
# search for entry with
# - type_code: hero
# return code + name

dir = "pack"
codes = {}
# get all files in dir
files = [os.path.join(dir, f) for f in os.listdir(dir) if os.path.isfile(os.path.join(dir, f))]

# read all files
for f in files:
    with open(f, "r") as file:
        content = file.read()
        j = json.loads(content)
        # get all heroes in the file
        entries = [entry for entry in j if 
        "type_code" in entry and  # has type_code field
        entry["type_code"] == "hero"] # type_code is hero
        # add heroes to map
        for e in entries:
            name = e["name"]
            while name in codes:
                name = name + "1"
            codes[name] = e["code"]

# save output next to script
scriptPath = os.path.abspath(__file__)
scriptDir = os.path.dirname(scriptPath)
outName = "hero_cards.json"
outPath = os.path.join(scriptDir, outName)
# delete if exists
if os.path.exists(outPath):
    os.remove(outPath)
# write output
with open(outPath, "xt") as f:
    f.write(json.dumps(codes))