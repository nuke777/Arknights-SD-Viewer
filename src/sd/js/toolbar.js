var toolbar = {
	init : function(){
		toolbar.toolbar = $("#toolbar");
		toolbar.record = $("#tool_record");
		toolbar.zoom = $("#tool_zoom");

		toolbar.record.click(function(){
			toolbar._record();
		});
		toolbar.zoom.click(function(){
			toolbar._zoom();
		});
	},

	_record : function(){
		if ($(".ctx_rec").length > 0){
			$(".ctx_rec").remove();
			toolbar.record.removeClass("tbb-highlight");
			return;
		}
		$("div.context").remove();
		$("div[id^='tool_']").filter("[id!='tool_record']").removeClass("tbb-highlight");

		toolbar.record.addClass("tbb-highlight");

		var record_btn = $("<div></div>");
		record_btn.addClass("recordButton");
		record_btn.addClass("btnGenericText");
		record_btn.attr("onclick","record()");
		record_btn.css({
			"font-size": "17px",
			"padding": "5px 10px 5px 10px",
			"height": "auto"
		});
		record_btn.html("Record");

		var output_btn = $("<div></div>");
		output_btn.addClass("outputButton");
		output_btn.addClass("btnGenericText");
		output_btn.attr("id", "outputButton");
		output_btn.attr("onclick", "output_file()");
		output_btn.css({
			"font-size": "17px",
			"padding": "5px 10px 5px 10px",
			"height": "auto"
		});
		output_btn.html("Output");

		var context = $("<div></div>");
		context.addClass("context");
		context.addClass("ctx_rec");
		context.css("top", window.pageYOffset + toolbar.record.position().top);
		$(window).scroll(function(){
            context.css("top", window.pageYOffset + toolbar.record.position().top);
        });
		context.append(record_btn);
		context.append(output_btn);

		$(document.body).append(context);
	},

	_zoom : function(){
		if ($(".ctx_zoom").length > 0){
			$(".ctx_zoom").remove();
			toolbar.zoom.removeClass("tbb-highlight");
			return;
		}
		$("div.context").remove();
		$("div[id^='tool_']").filter("[id!='tool_zoom']").removeClass("tbb-highlight");

		toolbar.zoom.addClass("tbb-highlight");

		var zoom_input = $("<input>");
		zoom_input.attr("type","range");
		zoom_input.attr("min","0");
		zoom_input.attr("max","1");
		zoom_input.attr("step","0.1");
		zoom_input.attr("value",viewer.scale);
		zoom_input.attr("id","zoom_input");
		zoom_input.on("input", () => {
        if (viewer.spine != null)
        	viewer.scale = zoom_input.val();
            viewer.spine.scale.set(viewer.scale, viewer.scale);
        });
		
		var context = $("<div></div>");
		context.addClass("context");
		context.addClass("ctx_zoom");
		context.css("top", window.pageYOffset + toolbar.zoom.position().top);
		$(window).scroll(function(){
            context.css("top", window.pageYOffset + toolbar.zoom.position().top);
        });
        context.append(zoom_input);

		$(document.body).append(context);
	}
};