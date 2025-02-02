import os
from wand.image import Image

imgFolder = "img"
outFolder = "crop"
shouldWidth = 300
# scale every card to 300 width
# crop out from 66, 55 => 174x174

# get all files in dir
files = [f for f in os.listdir(imgFolder) if os.path.isfile(os.path.join(imgFolder, f))]
for file in files:
    with Image(filename=os.path.join(imgFolder, file)) as img:
        factor = shouldWidth / img.width
        img.resize(width=shouldWidth, height=int(img.height * factor))
        img.crop(left=66, top=55, width=174, height=174)
        img.save(filename=os.path.join(outFolder, file.lower()))