var spinebar = {
	init : function() {
		spinebar.spinebar = $("#spinebar");
		spinebar.container = $("#spriteContainer")
	},
    addToSpriteList : function(json){
        var container = $("<div></div>");
        container.css({
        	"background-color": "#494a5a", 
        	"width": "100%",
        	"padding": "3px", 
        	"border": "2px solid #5c5d70",
        	"margin-bottom": "3px"
        });
        container.attr("id", json.id);
        container.click(function (){
        	spinebar.changeSelectedSprite(json.index, json.id);
        });

        var icon = $("<img>");
        icon.attr("src", viewer.assetURL + "portraits/" + json.icon.replace("build_","") + 
        	 (viewer.active == "enemy" ? ".png" : "_1.png"));
        icon.css({
        	"height": "60px", 
        	"width": "60px", 
        	"background-color": "white"
        });
        container.append(icon);

        spinebar.container.append(container);
        spinebar.changeSelectedSprite(json.index, json.id);
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
        viewer.changeAnimation(0);
    }
};