import json, requests, os

url = "https://marvelcdb.com/bundles/cards/{code}.jpg"
codeFile = "hero_cards.json"
outFolder = "img"

def formatName(name: str):
    return name.replace("-", "").replace("/", "").replace(" ", "").replace(".", "")

with open(codeFile, "r") as f:
    content = f.read()
    j = json.loads(content)
    for name in j:
        print(name)
        code = j[name]
        formatted = formatName(name)
        outPath = os.path.join(outFolder, f"{formatted}.jpg")
        r = requests.get(url.replace("{code}", code))
        # delete if exists
        if os.path.exists(outPath):
            os.remove(outPath)
        # write
        with open(outPath, "xb") as img:
            img.write(r.content)
