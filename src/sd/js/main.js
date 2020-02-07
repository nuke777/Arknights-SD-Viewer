$(document).ready(function(){
    viewer.init();
  });

var viewer = {
    init: function() {
        viewer.searchResults = charData;
        viewer.mouse = false;
        viewer.lastMouseX = 0;
        viewer.lastMouseY = 0;
        viewer.loaded = false;
        viewer.activeId = "";
        viewer.assetURL = "https://media.nuke.moe/arknights/";
        //viewer.assetURL = "../assets/";
        viewer.active = "operator";

        viewer.canvas = $(".Canvas");
        viewer.selectAnimation = $(".selectAnimation");
        viewer.selectOperator = $(".selectOperator");
        viewer.selectBG = $(".selectBG");

        viewer.selectAnimation.change(function() {
            viewer.changeAnimation(this.selectedIndex);
        });

        $(".vertical-descending").on("input", () => {
            if (viewer.spine != null)
                viewer.spine.scale.set($(".vertical-descending").val(), $(".vertical-descending").val());
        })

        viewer.app = new PIXI.Application(712, 512, { transparent: true });
        viewer.canvas.append($(viewer.app.view));
        $(viewer.app.view).mousedown(() => {
            viewer.mouse = true;
            viewer.lastMouseX = event.clientX - event.target.getBoundingClientRect().left;
            viewer.lastMouseY = event.clientY - event.target.getBoundingClientRect().top;
        });
        $(viewer.app.view).mouseup(() => {viewer.mouse = false});
        $(viewer.app.view).mousemove((event) => {
            var sx = event.clientX - event.target.getBoundingClientRect().left;
            var sy = event.clientY - event.target.getBoundingClientRect().top;
            if(viewer.mouse){
                viewer.spine.position.set((sx - viewer.lastMouseX) + viewer.spine.position._x, (sy - viewer.lastMouseY) + viewer.spine.position._y);

                viewer.lastMouseX = sx;
                viewer.lastMouseY = sy;
            }
        });

        window.onresize = (event) => {
            if (event === void 0) { event = null; }
            if (document.getElementById("darken") != null){
                document.getElementById("darken").top = window.pageYOffset + "px";
                document.getElementById("selector").top = (window.pageYOffset + (window.innerHeight * 0.05)) + "px";
            }
            var height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
                               document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );   
            $("#footer").css("top",height - $("#footer").height() - 20);
        };
        $(document).ready(() => {
            var height = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
                               document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );   
            $("#footer").css("top",height - $("#footer").height() - 20);
        });

        $("#front").click(() => {
            $("#front").addClass("active");
            $("#back").removeClass("active");
            $("#dorm").removeClass("active");
            viewer.sd = new SD(viewer.assetURL+'sd/front','front');
            if (viewer.loaded){
                viewer.toggleButtonState(true);
                viewer.sd.load(viewer.activeId, viewer, viewer.toggleButtonState);
            }
        }).trigger("click");
        $("#back").click(() => {
            $("#back").addClass("active");
            $("#front").removeClass("active");
            $("#dorm").removeClass("active");
            viewer.sd = new SD(viewer.assetURL+'sd/back','back');
            if (viewer.loaded){
                viewer.toggleButtonState(true);
                viewer.sd.load(viewer.activeId, viewer, viewer.toggleButtonState);
            }
        });
        $("#dorm").click(() => {
            $("#dorm").addClass("active");
            $("#back").removeClass("active");
            $("#front").removeClass("active");
            viewer.sd = new SD(viewer.assetURL+'sd/base','base');
            if (viewer.loaded){
                viewer.toggleButtonState(true);
                viewer.sd.load("build_"+viewer.activeId, viewer, viewer.toggleButtonState);
            }
        });
    },
    changeCanvas : function(skeletonData) {
        viewer.app.stage.removeChildren();

        viewer.spine = new PIXI.spine.Spine(skeletonData);
        var animations = viewer.spine.spineData.animations;
        var stringAnimations = "";
        for(var i = 0; i < animations.length; i++) {
            stringAnimations += "<option value=\"" + animations[i].name + "\">" + animations[i].name + "</option>";
        }
        viewer.selectAnimation.html(stringAnimations);
        viewer.changeAnimation(0);
        viewer.app.stage.addChild(viewer.spine);
        viewer.spine.position.set(viewer.app.view.width * 0.5 , viewer.app.view.height * 0.8);
    },
    changeAnimation : function(num) {
        var name = viewer.spine.spineData.animations[num].name;
        viewer.spine.state.setAnimation(0, name, true);
    },
    search : function(filter, filterType, key){
        if (filter != null && filterType != null){
            var temp = {};
            for (var value in viewer.searchResults){
                if (viewer.searchResults[value][filterType] == filter)
                    temp[value] = viewer.searchResults[value];                
            }
            viewer.searchResults = temp;
        }
        if (key != null){
            if (key == 8 || key == 46)
                viewer.searchResults = charData;
        }
        var data = {};
        var r = new RegExp($("#searchField").val().toLowerCase().trim());
        for (var value in viewer.searchResults){
            if (r.test(viewer.searchResults[value].name.toLowerCase()))
                data[value] = viewer.searchResults[value];
        }
        viewer.searchResults = data;
        viewer.loadFilter("type", "#searchType", "#ecd2fc");
        //viewer.loadFilter("group", "#searchGroup", "#ccccff");
        viewer.loadFilter("rarity", "#searchRarity", "white");
        console.log(viewer.searchResults);
        viewer.loadResults(viewer.searchResults);
    },
    loadResults : function(data){
        $("#resultContainer").empty();
        for (var value in data){
            var extension = "";
            if (viewer.active == "operator")
                extension = "_1.png";
            else
                extension = ".png";
            $("#resultContainer").append($("<div></div>")
                .addClass("operatorIcon")
                .attr("id",value)
                .css("background", getColor(data[value].rarity)+" url("+viewer.assetURL+"portraits/"+data[value].skin[0]+extension+")")
                .css("background-size", "70px 70px")
                .css("border-color", getColor(data[value].rarity))
                .mouseover(function(){
                    $(this).css("background-size", "105%");
                })
                .mouseout(function(){
                    $(this).css("background-size", "100%");
                })
                .click(function(){
                    $("#skinContainer").empty();
                    $("#back").css("display","inline-block");
                    $("#front").css("display","inline-block");
                    $("#dorm").css("display","inline-block");
                    if (data[$(this).attr("id")].front != null || data[$(this).attr("id")].back != null || data[$(this).attr("id")].front != null || data[$(this).attr("id")].shop != null){
                        if (data[$(this).attr("id")].front != null){
                            $("#front").css("display","none");
                            //$("#back").trigger("click");
                        }
                        if (data[$(this).attr("id")].back != null){
                            $("#back").css("display","none");
                            //$("#front").trigger("click");
                        }
                        if (data[$(this).attr("id")].shop != null){
                            $("#back").css("display","none");
                            $("#dorm").css("display","none");
                            //$("#front").trigger("click");
                        }
                    }
                    if (viewer.active == "enemy"){
                        $("#back").css("display","none");
                        $("#dorm").css("display","none");
                        $("#front").css("display","none");
                        viewer.sd = new SD(viewer.assetURL+'sd/enemy','enemy');
                    }
                    for (var x in data[$(this).attr("id")].skin){
                        $("#skinContainer").append($("<div></div>")
                            .addClass("operatorIcon")
                            .attr("id",data[$(this).attr("id")].skin[x])
                            .css("background", getColor(data[$(this).attr("id")].rarity)+" url("+viewer.assetURL+"portraits/"+data[$(this).attr("id")].skin[x]+extension+")")
                            .css("background-size", "70px 70px")
                            .css("border-color", getColor(data[$(this).attr("id")].rarity))
                            .click(function(){
                                viewer.activeId = $(this).attr("id");
                                if ($("#dorm").hasClass("active")){
                                    viewer.toggleButtonState(true);
                                    viewer.sd.load("build_"+viewer.activeId, viewer, viewer.toggleButtonState);
                                }
                                else{
                                    viewer.toggleButtonState(true);
                                    viewer.sd.load(viewer.activeId, viewer, viewer.toggleButtonState);
                                }
                                viewer.loaded = true;
                                var self = this;
                                $("#skinContainer").children("div").each(function(){
                                    if ($(this).attr("id") == $(self).attr("id"))
                                        $(this).css({"height":"60px","width":"60px","background-size":"100%"});
                                    else
                                        $(this).css({"height":"50px","width":"50px","background-size":"100%"});
                                });
                            }));                                                       
                        $('#selector').remove();
                        $('#darken').remove();
                        $(document.body).css("overflow", "auto");
                        viewer.searchResults = charData;
                    }
                    $("#skinContainer").children(":first").trigger("click");
                }));
        }
    },
    loadFilter : function (filterType, container, color){
        if ($(container).length == 0){
            $("#searchContainer").append($("<div></div>")
                .attr("id",container.substring(1))
                .css({"width" : "100%", "margin-top" : "15px"}));
        }
        $(container).empty();
        var words = [];
        for (var i in viewer.searchResults){
            words.push(viewer.searchResults[i][filterType]);
        }
        var distinct = [];
        $.each(words, function(i, val){
            if ($.inArray(val, distinct) === -1) distinct.push(val);
        });
        for (var j in distinct){
            $(container).append($("<div>"+distinct[j]+"</div>")
                .addClass("btnGenericText")
                .css({"display" : "inline-block", "margin" : "0px 0px 5px 10px", "color" : color})
                .click(function(){
                    viewer.search($(this).html(), filterType);
                }));
        }
    },
    toggleButtonState : function(b){
        viewer.selectOperator.prop("disabled", b);
        viewer.selectAnimation.prop("disabled", b);
        viewer.selectBG.prop("disabled", b);
        if (b){
            viewer.selectAnimation.css("color","gray");
            viewer.selectBG.css("color","gray");
            viewer.selectBG.attr("onclick","");
            viewer.selectOperator.css("color","gray");
            viewer.selectOperator.attr("onclick","");
        } else {
            viewer.selectAnimation.css("color","white");
            viewer.selectBG.css("color","white");
            viewer.selectBG.attr("onclick","onSelectBG()");
            viewer.selectOperator.css("color","white");
            viewer.selectOperator.attr("onclick","onSelectOperator()");
        }
    }
};

function onChangeLog(){
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
        .css("padding", "2%"))
    .css("overflow", "hidden");
    $("#selector").append($("<table></table>")
        .addClass("wikitable")
        .append($("<tr></tr>")
            .append($("<td></td>")
                .css("background-color", "#24252D")
                .css("height", "30px")
                .css("padding-left", "8px")
                .html("<b>Changelog</b>")
            )
        )
        .append($("<tr></tr>")
            .append($("<td></td>")
                .attr("id", "chglog")
                .css("padding", "15px")
                .css("vertical-align","text-top")
            )
        )
    )

    var cb = function (response){
        for (i in response){
            var message = response[i].commit.message;
            var date = response[i].commit.committer.date;
            date = date.replace("T", " ");
            date = date.replace("Z", " UTC");
            console.log(message, date);

            $("#chglog").append($("<p></p>")
                .css("line-height", "0.8")
                .html(message+"<br>")
                .append($("<font></font>")
                    .css("font-size", "10px")
                    .css("color", "gray")
                    .html(date)
                )
            );
        }
    }

    var xobj = new XMLHttpRequest();
    xobj.open("GET", "https://api.github.com/repos/alg-wiki/Arknights-SD-Viewer/commits?sha=gh-pages", true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            cb(JSON.parse(xobj.response));
          }
    };
    xobj.send(null); 
}

function onSelectBG(){
    var div = document.createElement('div');
    div.className = "darken";
    div.id = "darken";
    div.style.top = window.pageYOffset + "px";
    div.addEventListener("click", function(e) {
            document.body.removeChild(document.getElementById("selector"));
            document.body.removeChild(document.getElementById("darken"));
            document.body.style.overflow = "auto";
        }, false);
    document.body.appendChild(div);
    document.body.style.overflow = "hidden";
    var selector = document.createElement('div');
    selector.id = "selector";
    selector.className = "selector";
    selector.style.top = (window.pageYOffset + (window.innerHeight * 0.05)) + "px" ;
    document.body.appendChild(selector);
    for (var i = 0; i < backgroundData.length; i++){
        var img = document.createElement('div');
        img.className = "thumbbutton";
        img.style.backgroundImage = "url("+viewer.assetURL+"bg/"+backgroundData[i]+")";
        img.style.backgroundSize = "500px auto";
        img.style.backgroundPosition = "50% 50%";
        img.id = backgroundData[i];
        img.addEventListener("click", function(e) {
            document.getElementById("SdCanvas").style.backgroundImage = "url("+viewer.assetURL+"bg/"+this.id+")";
            document.body.removeChild(document.getElementById("selector"));
            document.body.removeChild(document.getElementById("darken"));
            document.body.style.overflow = "auto";
        }, false);
        document.getElementById("selector").appendChild(img);
    }
}

function onSelectOperator(){
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
        .css("top", (window.pageYOffset + (window.innerHeight * 0.05)) + "px"))
    .css("overflow", "hidden");

    $("#selector")
    .append($("<div></div>")
        .attr("id","searchContainer")
        .addClass("searchContainer")
        .css({"padding" : "15px"})
        .append($("<div></div>")
            .attr("id", "toggleContainer")
            .addClass("toggleContainer")
            .css("padding", "15px")
            .append($("<div></div>")
                .css("padding-right", "2%")
                .css("padding-bottom", "3px")
                .css("display", "inline-block")
                .css("vertical-align", "middle")
                .append($("<input>")
                    .attr('id', 'toggle')
                    .attr('data-toggle', 'toggle')
                    .prop('type', 'checkbox')
                    .prop('checked', true)
                )
            )                       
        )
    )
    .append($("<div></div>")
        .attr("id","resultContainer")
        .addClass("resultContainer")
    );
    $('#toggle').bootstrapToggle({
        on : 'Operator',
        off : 'Enemy',
        onstyle : 'success',
        offstyle : 'danger'
    })
    .change(function (){

        $("#searchField").remove();
        $("#searchType").remove();
        $("#searchRarity").remove();
        $("#resultContainer").empty();

        if (document.getElementById('toggle').checked){   
            viewer.active = "operator";
            $("#toggleContainer")
            .append($("<input>")
                .attr("id","searchField")
                .addClass("form-control")
                .css("display", "inline-block")
                .css("vertical-align", "middle")
                .css("width", "75%")
                .css({"background-color": "#24252d", "color": "#ffffff", "display" : "inline-block"})
                .on("keyup", function(){
                    var key = event.keyCode || event.charCode;
                    viewer.search(null, null, key);
                })
            )                    
            viewer.searchResults = charData;
            viewer.loadFilter("type", "#searchType", "#ecd2fc");
            //viewer.loadFilter("group", "#searchGroup", "#ccccff");
            viewer.loadFilter("rarity", "#searchRarity", "white");
            viewer.loadResults(viewer.searchResults); 
        } else {
            viewer.active = "enemy";
            viewer.searchResults = enemyData;
            viewer.loadResults(viewer.searchResults);
            $("#front").addClass("active");
            $("#back").removeClass("active");
            $("#dorm").removeClass("active");
            viewer.sd = new SD(viewer.assetURL+'sd/front','front');
        }
    });
    if (viewer.active == "operator") {
        $("#toggle").prop('checked', true).change();
    } else if (viewer.active == "enemy") {
        $("#toggle").prop('checked', false).change();
    }
}

function check(a, b){
    for (var x in charData) {
        for (var i in charData[x].skin){
            $.ajax({
                url:'../'+a+charData[x].skin[i]+b,
                type:'HEAD',
                error: function()
                {
                    console.log(charData[x].skin[i]);
                },
                success: function()
                {
                    //file exists
                }
            });
        }
    }
}

function getColor(rarity){
    switch(rarity){
        case "★":
            return "white";
            break;
        case "★★":
            return "#dce537";
            break;
        case "★★★":
            return "#00b3fd"; 
            break;
        case "★★★★":
            return "#dbb1db"; 
            break;
        case "★★★★★":
            return "#faeab0";  
            break;
        case "★★★★★★":
            return "#e1802f"; 
            break;
        default:
            return "black";
    }
}
