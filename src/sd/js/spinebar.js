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
        spinebar.option_flip_x(index, context);
        spinebar.option_flip_y(index, context);


    },
    option_zoom: function(index, context){
    	var zoom_container = $("<div></div>");
        zoom_container.css({
        	"border-bottom": "1px solid #5c5d70",
        	"width" : "100%",
        });
        context.append(zoom_container);

        var zoom_text = $("<font></font>");
        zoom_text.css({
        	"font-size" : "14px",
        	"margin-right" : "10px"
        });
        zoom_text.html("<b>Zoom</b>");
        zoom_container.append(zoom_text)

        var zoom_input = $("<input>");
		zoom_input.attr("type","range");
		zoom_input.attr("min","0");
		zoom_input.attr("max","1");
		zoom_input.attr("step","0.1");
		zoom_input.attr("value",viewer.spine[index].scale._x);
		zoom_input.attr("id","zoom_input");
		zoom_input.on("input", () => {
        if (viewer.spine[index] != null)
            viewer.spine[index].scale.set(zoom_input.val(), zoom_input.val());
        });
        zoom_container.append(zoom_input);
    },
    option_flip_x: function(index, context){
    	var flip_x_container = $("<div></div>");
        flip_x_container.css({
        	"border-bottom": "1px solid #5c5d70",
        	"width" : "100%",
        });
        context.append(flip_x_container);

        var flip_x_text = $("<font></font>");
        flip_x_text.css({
        	"font-size" : "14px",
        	"margin-right" : "10px"
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
        });
        context.append(flip_y_container);

        var flip_y_text = $("<font></font>");
        flip_y_text.css({
        	"font-size" : "14px",
        	"margin-right" : "10px"
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