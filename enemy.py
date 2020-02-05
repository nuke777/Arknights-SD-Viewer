import os
import re

filestring = "var enemyData = {\n"
path = "C:/Users/Nukeclear/Documents/GitHub/candy/assets/sd/enemy"

for file in os.listdir(path):
	id = file
	if (re.match("enemy_\d\d\d\d_[a-zA-Z0-9_]*\.png", id)):
		id = id[:-4]
		filestring += '\t"'+re.sub("enemy_\d\d\d\d_","",id)+'" : {\n'
		filestring += '\t\t"name" : "'+re.sub("enemy_\d\d\d\d_","",id)+'",\n'	
		filestring += '\t\t"skin" : ["'+id
		filestring += '"]\n\t},\n'

filestring += "};"
print(filestring)
text_file = open("src/sd/js/enemyData.js", "w")
text_file.write(filestring)
text_file.close()