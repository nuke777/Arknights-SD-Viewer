$(document).ready(function(){
	init();
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

function init(){
	group_by();
}

function load(csv){
	Papa.parse(csv, {
		download: true,
		complete: function(results){
			calc(results.data, false);
		}
	});
}

function calc(data, recalc){
	this.array_data = [];
	if (data[0][0] == "Risk")
		data.shift();
	console.log(data);
	if (recalc){
		var temp = []
		for (i in data){
			if (this.selected_risk.indexOf(data[i][0]) !== -1)
				temp.push(data[i]);
		}
		data = temp;
		console.log(data);
	}
	
	for (x in charData){
		var count = 0;
		for (i in data){
			if (data[i][3] == charData[x].name){
				++count;
			}
		}
		if (count > 0){
			this.array_data.push({});
			this.array_data[this.array_data.length-1].name = charData[x].name;
			this.array_data[this.array_data.length-1].count = count;
			this.array_data[this.array_data.length-1].class = charData[x].type;
			this.array_data[this.array_data.length-1].pct = (Math.round(((count/data.length) * 100) * 10) / 10) + "%";
			this.array_data[this.array_data.length-1].rarity = charData[x].rarity;
			this.array_data[this.array_data.length-1].icon = charData[x].skin[0];
		}
	}
	//---------
	var cnt = 0;
	for (i in data){
		if (data[i][3] == ""){
			++cnt;
		}
	}
	this.array_data.push({});
	this.array_data[this.array_data.length-1].name = "No Support";
	this.array_data[this.array_data.length-1].count = cnt;
	this.array_data[this.array_data.length-1].class = "No Support";
	this.array_data[this.array_data.length-1].pct = (Math.round(((cnt/data.length) * 100) * 10) / 10) + "%";
	this.array_data[this.array_data.length-1].rarity = "No Support";
	this.array_data[this.array_data.length-1].icon = "";
	//---------
	if (!recalc) {
		this.raw_data = data;
		risk_level();
	}
	console.log(this.array_data);	
}

function group_by(){
	var tag_class = $("#tag-class");
	var tag_rarity = $("#tag-rarity");
	var thisRef = this;

	tag_rarity.click(function(){
		if (!tag_rarity.hasClass("cc-body-tag-active")){
			tag_rarity.addClass("cc-body-tag-active");
			tag_class.removeClass("cc-body-tag-active");
			thisRef.active_group = "rarity";
			query();
		}
	});

	tag_class.click(function(){
		if (!tag_class.hasClass("cc-body-tag-active")){
			tag_class.addClass("cc-body-tag-active");
			tag_rarity.removeClass("cc-body-tag-active");
			thisRef.active_group = "class";
			query()
		}
	});

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

function risk_level(){	
	for (i in this.raw_data){
		if (!this.risk.includes(this.raw_data[i][0]))
			this.risk.push(this.raw_data[i][0]);
	}
	this.risk.sort((a, b) => a - b);
	var thisRef = this;
	for (var i in this.risk){
		var risk = this.risk[i];
		var risk_btn = $("<div></div>");
		risk_btn.addClass("cc-body-tag");
		risk_btn.html(risk);
		risk_btn.attr("id","risk_btn_"+risk);
		risk_btn.click({risk: risk},function (event) {
			var btn = $("#risk_btn_"+event.data.risk);
			if (btn.hasClass("cc-body-tag-active")){
				btn.removeClass("cc-body-tag-active");
				var index = thisRef.selected_risk.indexOf(event.data.risk);
				if (index !== -1) thisRef.selected_risk.splice(index, 1);
				if (thisRef.selected_risk.length == 0){
					$("#tag-all").addClass("cc-body-tag-active");
					thisRef.selected_risk = thisRef.risk;
				}
				calc(thisRef.raw_data, true);
				query();
			} else {
				if ($("#tag-all").hasClass("cc-body-tag-active"))
					thisRef.selected_risk = [];
				$("#tag-all").removeClass("cc-body-tag-active");
				btn.addClass("cc-body-tag-active");
				thisRef.selected_risk.push(event.data.risk);
				calc(thisRef.raw_data, true);
				query();
			}
			console.log(thisRef.selected_risk);
		});
		$("#risk_container").append(risk_btn);
	}

	var tag_all = $("#tag-all");
	tag_all.click(function(){
		if (!tag_all.hasClass("cc-body-tag-active")){
			tag_all.addClass("cc-body-tag-active");
		}
		thisRef.selected_risk = thisRef.risk;
		$("[id^=risk_btn_]").removeClass("cc-body-tag-active");
		console.log(thisRef.selected_risk);
		calc(thisRef.raw_data, true);
		query();
	});

	$(".cc-loader-body").css({"display":"none"});
	$(".cc-body").css({"display":"inline-block"});
	query();
}

function query(){
	this.json_data = {};
	for (var x in this.array_data){
		if (this.json_data[this.array_data[x][this.active_group]] == null){
			this.json_data[this.array_data[x][this.active_group]] = {};
		}
	}
	for (var x in this.json_data){
		var temp = [];
		for (var y in this.array_data){
			if (this.array_data[y][this.active_group] == x)
				temp.push(this.array_data[y]);
		}
		this.json_data[x] = sort(temp);
	}
	render();
}

function sort(data){
	if (data.length < 1)
		return [];

	var left = [];
	var right = [];
	var pivot = data[0];

	for (var i = 1; i < data.length; i++){
		if (data[i].count > pivot.count){
			left.push(data[i]);
		} else {
			right.push(data[i]);
		}
	}

	return [].concat(sort(left), pivot, sort(right));
}

function render(){
	var keys = Object.keys(this.json_data);
	keys.sort();
	keys.reverse();
	$("#cc_main_body").find(".cc-operator-group-header").remove();
	$("#cc_main_body").find(".cc-operator-container").remove();
	for (var x in keys){
		var header = $("<div></div>");
		header.addClass("cc-operator-group-header");
		header.html(keys[x]);
		$("#cc_main_body").append(header);

		for (var y in this.json_data[keys[x]]){
			var op = this.json_data[keys[x]][y];

			var container = $("<div class='cc-operator-container'></div>");
			container.append($("<div class='cc-operator-rect'></div>"));
			container.append($("<div class='cc-operator-tri'></div>"));

			var icon = $("<div class='cc-operator-icon'></div>");
			icon.css({"background-image":"url("+this.assetURL+"portraits/"+op.icon+"_1.png)"});

			container.append(icon);
			container.append($("<div class='cc-operator-text cc-operator-text-count'>"+op.count+"</div>"));
			container.append($("<div class='cc-operator-text cc-operator-text-pct'>"+op.pct+"</div>"));
			container.append($("<div class='cc-operator-text cc-operator-text-name'>"+op.name+"</div>"));

			$("#cc_main_body").append(container);

		}
	}
}