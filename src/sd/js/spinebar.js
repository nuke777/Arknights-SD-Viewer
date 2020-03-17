var spinebar = {
	init : function() {
		spinebar.spinebar = $("#spinebar");
		spinebar.container = $("#spriteContainer");
		spinebar.removeSprite = $("#removeSprite");

		spinebar.list = [];


		spinebar.removeSprite.click(spinebar._removeSprite);
	},
    addToSpriteList : function(json){
    	spinebar.list.push(json);

        var container = $("<div></div>");
        container.css({
        	"background-color": "#494a5a", 
        	"width": "100%",
        	"border": "2px solid #5c5d70",
        	"margin-bottom": "3px"
        });
        container.attr("id", spinebar.list[spinebar.list.length-1].id);
        spinebar.container.append(container);
        
        var option = $("<div></div>");
        option.addClass("spineoptionbutton");
        option.addClass("material-icons");
        option.attr("id",spinebar.list[spinebar.list.length-1].id + "_option")
        option.html("keyboard_arrow_left");
        option.click(function(){
        	for (var i in spinebar.list){
        		if (spinebar.list[i].id == json.id)
        			spinebar.spriteOptions(spinebar.list[i].id);
        	}
        });
        container.append(option);

        var innerCont = $("<div></div>");
        innerCont.css({        	
        	"padding": "3px",
        	"cursor": "pointer"
        });
        innerCont.click(function (){
        	for (var i in spinebar.list){
        		if (spinebar.list[i].id == json.id)
        			spinebar.changeSelectedSprite(parseInt(i), spinebar.list[i].id);
        	}
        });
        container.append(innerCont);

        var icon = $("<img>");
        icon.attr("src", viewer.assetURL + "portraits/" + spinebar.list[spinebar.list.length-1].icon.replace("build_","") + 
        	 (viewer.active == "enemy" ? ".png" : "_1.png"));
        icon.css({
        	"height": "60px", 
        	"width": "60px", 
        	"background-color": "white"
        });
        innerCont.append(icon);

        
        spinebar.changeSelectedSprite(spinebar.list.length-1, spinebar.list[spinebar.list.length-1].id);
        viewer.changeAnimation(0);
    },
    changeSelectedSprite: function(index, id){
    	spinebar.container.children().css("border", "2px solid #5c5d70");
    	$("#"+id).css("border", "2px solid red");
    	viewer.selectedSpine = index;

    	var animations = viewer.spine[viewer.selectedSpine].spineData.animations;
        var stringAnimations = "";
        for(var i = 0; i < animations.length; i++) {
            stringAnimations += "<option value=\"" + animations[i].name + "\">" + animations[i].name + "</option>";
        }
        viewer.selectAnimation.html(stringAnimations);
    },
    spriteOptions: function(id){
    	if ($("."+id + "_context").length > 0){
    		$("."+id + "_context").remove();
    		$("#"+id).children("div.spineoptionbutton.material-icons").css({
	    		"background-color": "#373743",
	    		"color": "white"
	    	});
    		return;
    	}
    	$("div.rightContext").remove();
    	$("#"+id).children("div.spineoptionbutton.material-icons").css({
    		"background-color": "white",
    		"color": "black"
    	});
    	$("div.spineoptionbutton.material-icons").filter("[id!='"+id+"_option']").css({
    		"background-color": "#373743",
    		"color": "white"
    	});

    	var index = 0;
    	for (var i in spinebar.list){
    		if (spinebar.list[i].id == id)
    			index = parseInt(i);
    	}

    	var context = $("<div></div>");
		context.addClass("rightContext");
		context.addClass(id + "_context");
		context.css("top", window.pageYOffset + $("#"+id).position().top);
		$(window).scroll(function(){
			if ($("#"+id).length == 0)
				return;
            context.css("top", window.pageYOffset + $("#"+id).position().top);
        });
        $(document.body).append(context);

        spinebar.option_zoom(index, context);
        spinebar.option_speed(index, context);
        spinebar.option_flip_x(index, context);
        spinebar.option_flip_y(index, context);

    },
    option_zoom: function(index, context){
    	var zoom_container = $("<div></div>");
        zoom_container.css({
        	"border-bottom": "1px solid #5c5d70",
        	"width" : "100%",
        	"height" : "35px"
        });
        context.append(zoom_container);

        var zoom_text = $("<font></font>");
        var zoom_input = $("<input>");
        var zoom_text_input = $("<input>");

        zoom_container.append(zoom_text)
        zoom_container.append(zoom_text_input);
        zoom_container.append(zoom_input);

        zoom_text.css({
        	"font-size" : "14px",
        	"margin-right" : "10px",
        	"display" : "inline-block",
        	"line-height" : "35px",
        	"vertical-align" : "middle"
        });
        zoom_text.html("<b>Zoom</b>");

		zoom_input.attr("type","range");
		zoom_input.attr("min","0");
		zoom_input.attr("max","1");
		zoom_input.attr("step","0.1");
		zoom_input.attr("value",viewer.spine[index].scale._x);
		zoom_input.attr("id","zoom_input");
		zoom_input.css({
        	"display" : "inline-block",
        	"line-height" : "35px",
        	"vertical-align" : "middle"
        });
		zoom_input.on("input", () => {
        if (viewer.spine[index] != null)
            viewer.spine[index].scale.set(zoom_input.val(), zoom_input.val());
        	zoom_text_input.val(zoom_input.val());
        });

        zoom_text_input.attr("type","number");
        zoom_text_input.attr("min","0");
        zoom_text_input.attr("max","1");
        zoom_text_input.attr("step","0.1");
        zoom_text_input.attr("value",viewer.spine[index].scale._x);
        zoom_text_input.attr("id","zoom_text_input");
        zoom_text_input.css({
        	"width": "40px",
        	"height": "20px",
        	"font-size": "12px",
        	"margin-right": "10px"
        });
        zoom_text_input.on("input", function(){
        	if (zoom_text_input.val() < 0){
        		zoom_text_input.css("color","red");
        	} 
        	if (zoom_text_input.val() > 1){
        		zoom_text_input.css("color","red");
        	}
        	if ((zoom_text_input.val() <= 1) && (zoom_text_input.val() >= 0)){
        		zoom_text_input.css("color","black");
        		zoom_input.val(zoom_text_input.val());
        		zoom_input.trigger("input");
        	}
        	
        });
    },
    option_flip_x: function(index, context){
    	var flip_x_container = $("<div></div>");
        flip_x_container.css({
        	"border-bottom": "1px solid #5c5d70",
        	"width" : "100%",
        	"height" : "35px"
        });
        context.append(flip_x_container);

        var flip_x_text = $("<font></font>");
        flip_x_text.css({
        	"font-size" : "14px",
        	"margin-right" : "10px",
        	"display" : "inline-block",
        	"line-height" : "35px",
        	"vertical-align" : "middle"
        });
        flip_x_text.html("<b>FlipX</b>");
        flip_x_container.append(flip_x_text)

        var flip_x_input = $("<input>")
        flip_x_input.attr("type","checkbox");
        flip_x_input.attr("id","flip_x_input");
        flip_x_input.prop("checked", viewer.spine[index].skeleton.flipX);
        flip_x_input.click(function(){
        	viewer.spine[index].skeleton.flipX = this.checked;
        });
        flip_x_container.append(flip_x_input);
    },
    option_flip_y: function(index, context){
    	var flip_y_container = $("<div></div>");
        flip_y_container.css({
        	"border-bottom": "1px solid #5c5d70",
        	"width" : "100%",
        	"height" : "35px"
        });
        context.append(flip_y_container);

        var flip_y_text = $("<font></font>");
        flip_y_text.css({
        	"font-size" : "14px",
        	"margin-right" : "10px",
        	"display" : "inline-block",
        	"line-height" : "35px",
        	"vertical-align" : "middle"
        });
        flip_y_text.html("<b>FlipY</b>");
        flip_y_container.append(flip_y_text)

        var flip_y_input = $("<input>")
        flip_y_input.attr("type","checkbox");
        flip_y_input.attr("id","flip_y_input");
        flip_y_input.prop("checked", viewer.spine[index].skeleton.flipY);
        flip_y_input.click(function(){
        	viewer.spine[index].skeleton.flipY = this.checked;
        });
        flip_y_container.append(flip_y_input);
    },
    option_speed: function(index, context){
    	var speed_container = $("<div></div>");
        speed_container.css({
        	"border-bottom": "1px solid #5c5d70",
        	"width" : "100%",
        	"height" : "35px"
        });
        context.append(speed_container);

        var speed_text = $("<font></font>");
        var speed_input = $("<input>");
        var speed_text_input = $("<input>");

        speed_container.append(speed_text)
        speed_container.append(speed_text_input);
        speed_container.append(speed_input);

        speed_text.css({
        	"font-size" : "14px",
        	"margin-right" : "10px",
        	"display" : "inline-block",
        	"line-height" : "35px",
        	"vertical-align" : "middle"
        });
        speed_text.html("<b>Speed</b>");

		speed_input.attr("type","range");
		speed_input.attr("min","0.01");
		speed_input.attr("max","8.00");
		speed_input.attr("step","0.01");
		speed_input.attr("value",viewer.spine[index].state.timeScale);
		speed_input.attr("id","speed_input");
		speed_input.css({
        	"display" : "inline-block",
        	"line-height" : "35px",
        	"vertical-align" : "middle"
        });
		speed_input.on("input", () => {
        if (viewer.spine[index] != null)
            viewer.spine[index].state.timeScale = speed_input.val();
        	speed_text_input.val(speed_input.val());
        });

        speed_text_input.attr("type","number");
        speed_text_input.attr("min","0.01");
        speed_text_input.attr("max","8.00");
        speed_text_input.attr("step","0.01");
        speed_text_input.attr("value",viewer.spine[index].state.timeScale);
        speed_text_input.attr("id","speed_text_input");
        speed_text_input.css({
        	"width": "45px",
        	"height": "20px",
        	"font-size": "12px",
        	"margin-right": "10px"
        });
        speed_text_input.on("input", function(){
        	if (speed_text_input.val() < 0.01){
        		speed_text_input.css("color","red");
        	} 
        	if (speed_text_input.val() > 8){
        		speed_text_input.css("color","red");
        	}
        	if ((speed_text_input.val() <= 8) && (speed_text_input.val() >= 0.01)){
        		speed_text_input.css("color","black");
        		speed_input.val(speed_text_input.val());
        		speed_input.trigger("input");
        	}
        	
        });
    },    
    _removeSprite: function(){
    	if (spinebar.list.length == 0)
    		return;
    	viewer.spine.splice(viewer.selectedSpine, 1);
    	viewer.app.stage.removeChildAt(viewer.selectedSpine+1);
    	$("#"+spinebar.list[viewer.selectedSpine].id).remove();
    	if ($("."+ spinebar.list[viewer.selectedSpine].id + "_context").length > 0)
    		$("."+ spinebar.list[viewer.selectedSpine].id + "_context").remove();
    	spinebar.list.splice(viewer.selectedSpine, 1);
    	if (spinebar.list.length-1 > -1)
    		spinebar.changeSelectedSprite(spinebar.list.length-1, spinebar.list[spinebar.list.length-1].id);
    }
};