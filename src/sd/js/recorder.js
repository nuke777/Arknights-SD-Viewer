var capturer;
var canvas;
var isRecording = false;
var blob = [];
var guid = [];

function render(){
    requestAnimationFrame(render);
    capturer.capture(canvas);
}

function record(){
    var recordButton = $(".recordButton");
    isRecording = !isRecording;

    if (isRecording){
        recordButton.html("<b style=\"color:red\">Record</b>");
        $("canvas").css({
            "outline-style": "solid",
            "outline-color": "red",
            "outline-width": "2px"
        });

        capturer = new CCapture( { format: 'gif', workersPath: 'src/sd/js/'} );
        canvas = document.querySelector('canvas');
        render();
        capturer.start();
    } else {
        recordButton.html("<b>Record</b>");
        $("canvas").css("outline-width", "0px");

        capturer.stop();
        var thisRef = this;
        capturer.save(function(blob){
            thisRef.blob.push(blob);
            thisRef.guid.push(guidGenerator());
            //document.getElementById('test').src = URL.createObjectURL(blob);
        });
    }
}

function output_file(){
    $(document.body).append($("<div></div>")
        .attr("id","darken")
        .addClass("darken")
        .css("top", window.pageYOffset + "px")
        .click(function(){
            $('#selector').remove();
            $('#darken').remove();
            $(document.body).css("overflow", "auto");
            viewer.searchResults = charData;
        }))
    .append($("<div></div>")
        .attr("id","selector")
        .addClass("selector")
        .css("top", (window.pageYOffset + (window.innerHeight * 0.05)) + "px")
        .css("padding", "20px")
        .attr("align", "center")
        .append($("<font></font>")
            .html("Right click to save. Refreshing will delete all cached recordings.")
            .css("margin-bottom", "5px")
        )
        .append($("<div></div>")
            .css({
                "height": "120px",
                "width": "100%",
                "background-color": "#373743",
                "border-style": "solid",
                "border-color": "#5c5d70",
                "border-width": "1px",
                "margin-bottom": "20px",
                "overflow-x": "auto",
                "white-space": "nowrap"
            })
            .attr("id","output_catalog")
            .attr("align", "left")
        )
        .append($("<img>").attr("id","output_image"))
    )
    .css("overflow", "hidden");

    for (x in this.blob){
        $("#output_catalog").append($("<img>")
            .attr("src", URL.createObjectURL(this.blob[x]))
            .addClass(this.guid[x])
            .css({
                "height": "80%",
                "width": "auto",
                "margin-top": ($("#output_catalog").height() * 0.1) +"px",
                "margin-left": ($("#output_catalog").height() * 0.1) +"px",
                "display": "inline-block",
                "cursor": "pointer"
            })
            .click(function(){
                $("#output_image").attr("src", this.src);
                $(this).css({
                    "outline-style": "solid",
                    "outline-color": "white",
                    "outline-width": "2px",
                });
                $("img[class!='"+this.className+"']").css("outline-width","0px");
            })

        );
    }
    //document.getElementById('output_image').src = URL.createObjectURL(this.blob);
}

function guidGenerator(){
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}   
