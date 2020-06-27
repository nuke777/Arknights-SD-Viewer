$(document).ready(function(){
	footer();
	load("csv/data.csv");
 });

this.array_data = [];
this.risk = [];
this.selected_risk = [];
//this.assetURL = "https://media.nuke.moe/arknights/";
this.assetURL = "../../assets/";
this.active_group = "class";
this.json_data = {};
this.raw_data = [];

function footer(){
	var height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
                       document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );  
    $("#footer").css("top",height - $("#footer").height() - 20);
    window.onresize = (event) => {
	    var height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
	                       document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );  
	    $("#footer").css("top",height - $("#footer").height() - 20);
	};
	$(window).scroll(function(){
        var height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
	                       document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );  
	    $("#footer").css("top",height - $("#footer").height() - 20);
    });
}


function load(csv){
	Papa.parse(csv, {
		download: true,
		complete: function(results){
			calc(results.data);
		}
	});
}

function calc(data){
	if (data[0][0] == "Risk")
		data.shift();
	icon = {};
	for (var x in charData){
		icon[charData[x].name] = charData[x].skin[0];
	}
	for (var x in data){
		var tr = $("<tr></tr>");
		for (var y in data[x]){
			console.log(y);
			switch (y){
				case "0":
					tr.append("<td>"+data[x][y]+"</td>");
					break;
				case "1":
					tr.append("<td><a href='"+data[x][y]+"'><img src='../img/link-16.png'></a></td>")
					break; 
				case "2":
					tr.append("<td><a href='img/"+data[x][y]+"'><img src='img/"+data[x][y]+"' style='height: auto; width: 100px;'></a></td>")
					break;
				default:
					if (icon[data[x][y]] == null){
						tr.append("<td></td>");
						break;
					}
					tr.append("<td><img src='../../assets/portraits/"+icon[data[x][y]]+"_1.png' style='height: auto; width: 50px;' title=\""+data[x][y]+"\"></td>")
					break;
			}
		}
		$(".wikitable").append(tr);
	}
	$(".cc-loader-body").css({"display":"none"});
	$(".cc-body").css({"display":"inline-block"});
}

