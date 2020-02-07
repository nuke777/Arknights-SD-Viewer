var capturer;
var canvas;
var recordButton = $(".recordButton");
var isRecording = false;
var blob = "blub";


function render(){
    requestAnimationFrame(render);
    capturer.capture(canvas);
}

function record(){
    isRecording = !isRecording;

    if (isRecording){
        recordButton.html("<b style=\"color:red\">● Record</b>");
        $(".outputButton").css("color","gray").attr("onclick","");

        capturer = new CCapture( { format: 'gif', workersPath: 'src/sd/js/'} );
        canvas = document.querySelector('canvas');
        render();
        capturer.start();
    } else {
        recordButton.html("<b>● Record</b>");

        capturer.stop();
        var thisRef = this;
        capturer.save(function(blob){
            $(".outputButton").css("color","white").attr("onclick","output_file()");
            thisRef.blob = blob;
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
        .attr("align", "center")
        .append($("<img>").attr("id","output_image"))
    )
    .css("overflow", "hidden");
    document.getElementById('output_image').src = URL.createObjectURL(this.blob);
}
