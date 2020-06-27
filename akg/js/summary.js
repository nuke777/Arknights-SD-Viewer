$(document).ready(function(){
	footer();
	//load("csv/topsquad.csv");
	$(".cc-loader-body").css({"display":"none"});
	$(".cc-body").css({"display":"inline-block"});
	snap();
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

function snap(){
	$(".screencap-bg").click(function(){
		html2canvas(document.querySelector(".cc-body"), {backgroundColor: null}).then(canvas => {
			$(document.body).append($("<div></div>")
		        .attr("id","darken")
		        .addClass("darken")
		        .css("top", window.pageYOffset + "px")
		        .click(function(){
		            $('#selector').remove();
		            $('#darken').remove();
		            $(document.body).css("overflow", "auto");
		        }))
		    .append($("<div></div>")
		        .attr("id","selector")
		        .addClass("selector")
		        .css("top", (window.pageYOffset + (window.innerHeight * 0.05)) + "px")
		        .css("padding", "2%")
		        .append(canvas))
		    .css("overflow", "hidden");
		    $("canvas").css({"width":"95%", "height": "auto"});
		});
	});
}
