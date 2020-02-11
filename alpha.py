import os
import re
import math
import shutil

from PIL import Image

baseurl = "assets/sd/"
folders = ["base/","back/","front/"]

for i in folders:
	for file in os.listdir(baseurl + i):
		if (file[-4:] == ".png"):
			if (file[:-4][-7:] != "[alpha]"):
				f = file[:-4]
				base = Image.open(baseurl + i + f + ".png")
				try:
					mask = Image.open(baseurl + i + f + "[alpha].png")
				except Exception:
					print("No " + f + " alpha found.")
					continue;
				mask = mask.convert("L")
				base.putalpha(mask)
				base.save("output/" + i + f + ".png")