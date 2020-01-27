import os
import re
import math
import shutil

from PIL import Image
from shutil import copyfile

path = "E:/Nox/Nox_share/OtherShare/AK/01-24-2020_CN/charpack"
base = "C:/Users/Nukeclear/Documents/GitHub/candy/assets/sd/base/"
front = "C:/Users/Nukeclear/Documents/GitHub/candy/assets/sd/front/"
back = "C:/Users/Nukeclear/Documents/GitHub/candy/assets/sd/back/"

def clean(file):
	file = re.sub("\s","",file)
	file = re.sub("#\d*","",file)
	file = re.sub("\.txt","",file)
	return file

for file in os.listdir(path):
	id = file[:-3]
	if (re.match("char_\d\d\d_.*", id)):
		for imgfile in os.listdir(path+"/Texture2D"):
			if (re.match(".*"+id+".*", imgfile)):
				#base
				if (imgfile[:5] == "build"):
					copyfile(path+"/Texture2D/"+imgfile, base + clean(imgfile))
		for file2 in os.listdir(path+"/TextAsset"):
			if (re.match(".*"+id+".*", file2)):
				if (file2[:5] == "build"):
					copyfile(path+"/TextAsset/"+file2, base + clean(file2))

list1 = []
list2 = []

for file in os.listdir(path):
	id = file[:-3]
	if (re.match("char_\d\d\d_.*", id)):
		for imgfile in os.listdir(path+"/Texture2D"):
			x = re.findall("^("+id+")\s?#?[0-9]*\.png$", imgfile)
			if (len(x) != 0):
				if (x[0] not in list1):
					list1.append(x[0])
					print(imgfile)
			x = re.findall("^("+id+"_[a-zA-Z]+[0-9]*)\s?#?[0-9]*\s?#?[0-9]*\.png$", imgfile)
			if (len(x) != 0):
				if (x[0] not in list1):
					list1.append(x[0])
					print(imgfile)
			x = re.findall("^("+id+"\[alpha\])\s?#?[0-9]*\.png$", imgfile)
			if (len(x) != 0):
				if (x[0] not in list1):
					list1.append(x[0])
					print(imgfile)
			x = re.findall("^("+id+"_[a-zA-Z]+[0-9]*)[0-9#\s]*\[alpha\][0-9#\s]*\.png$", imgfile)
			if (len(x) != 0):
				if ((x[0]+"[alpha]") not in list1):
					list1.append(x[0]+"[alpha]")
					print(imgfile)


print(list1)

for id in list1:
	print(id)
	count = 0
	for imgfile in os.listdir(path+"/Texture2D"):
		if (re.match(re.escape(id)+"[0-9#\s]*\.png", clean(imgfile))):
			im = Image.open(path+"/Texture2D/"+imgfile)
			h,w = im.size
			if (h < 1024):
				list2.append(imgfile)
				count = count + 1
	if (count == 2):
		size1 = os.stat(path+"/Texture2D/"+list2[0]).st_size
		size2 = os.stat(path+"/Texture2D/"+list2[1]).st_size
		if (size1 > size2):
			copyfile(path+"/Texture2D/"+list2[0], front + clean(list2[0]))
			copyfile(path+"/Texture2D/"+list2[1], back + clean(list2[1]))
		else:
			copyfile(path+"/Texture2D/"+list2[1], front + clean(list2[1]))
			copyfile(path+"/Texture2D/"+list2[0], back + clean(list2[0]))
		list2 = []
		count = 0

	list2 = []
	count = 0
	for binfile in os.listdir(path+"/TextAsset"):
		if (re.match(re.escape(id)+"[0-9#\s]*\.skel", clean(binfile))):
			list2.append(binfile)
			count = count + 1
	if (count == 2):
		size1 = os.stat(path+"/TextAsset/"+list2[0]).st_size
		size2 = os.stat(path+"/TextAsset/"+list2[1]).st_size
		if (size1 > size2):
			copyfile(path+"/TextAsset/"+list2[0], front + clean(list2[0]))
			copyfile(path+"/TextAsset/"+list2[1], back + clean(list2[1]))
		else:
			copyfile(path+"/TextAsset/"+list2[1], front + clean(list2[1]))
			copyfile(path+"/TextAsset/"+list2[0], back + clean(list2[0]))
		list2 = []
		count = 0

	list2 = []
	count = 0
	for binfile in os.listdir(path+"/TextAsset"):
		if (re.match(re.escape(id)+"[0-9#\s]*\.atlas", clean(binfile))):
			list2.append(binfile)
			count = count + 1
	if (count == 2):
		size1 = os.stat(path+"/TextAsset/"+list2[0]).st_size
		size2 = os.stat(path+"/TextAsset/"+list2[1]).st_size
		if (size1 > size2):
			copyfile(path+"/TextAsset/"+list2[0], front + clean(list2[0]))
			copyfile(path+"/TextAsset/"+list2[1], back + clean(list2[1]))
		else:
			copyfile(path+"/TextAsset/"+list2[1], front + clean(list2[1]))
			copyfile(path+"/TextAsset/"+list2[0], back + clean(list2[0]))
		list2 = []
		count = 0
	list2 = []
	count = 0

filestring = "var charData = {\n"

for file in os.listdir(path):
	id = file[:-3]
	if (re.match("char_\d\d\d_.*", id)):
		filestring += '\t"'+re.sub("char_\d\d\d_","",id)+'" : {\n'
		filestring += '\t\t"name" : "'+re.sub("char_\d\d\d_","",id)+'",\n'
		filestring += '\t\t"type" : "",\n'
		filestring += '\t\t"group" : "",\n'
		filestring += '\t\t"rarity" : "",\n'		
		filestring += '\t\t"skin" : ['
		for x in list1:
			if (re.match(re.escape(id) + ".*", x)):
				if (x[-7:] != "[alpha]"):
					filestring += '"' + x + '",'
		filestring += ']\n\t},\n'

filestring += "};"
print(filestring)
text_file = open("src/sd/js/charData.js", "w")
text_file.write(filestring)
text_file.close()