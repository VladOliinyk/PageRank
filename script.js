$(document).ready(function () {

    var MAX_VALUE = 20;

    var DENSITY = 5; // 0 .. 100%


    // container height
    $(".bottomContent").css({
        height: ($(window).height() - 170)
    });

    $("#statsResults").css({
        height: ($(window).height() - 210)
    });

    // COUNTER
    var itemsCountBlock = $("#itemsCountInput");
    var densityInput = $("#densityInput");


    $("#ltemsCountInputButtonMinus1").click(function () {
        updateItemsCountValue(-1);
    });
    $("#ltemsCountInputButtonMinus5").click(function () {
        updateItemsCountValue(-5);
    });

    $("#ltemsCountInputButtonPlus1").click(function () {
        updateItemsCountValue(+1);
    });
    $("#ltemsCountInputButtonPlus5").click(function () {
        updateItemsCountValue(+5);
    });

    $("#ltemsCountInputButtonReset").click(function () {
        updateItemsCountValue("reset");
    });
    $("#ltemsCountInputButtonMax").click(function () {
        updateItemsCountValue("max");
    });


    // DENSITY
    $("#densityInoutButtonMax").click(function () {
        updateDensityValue("max");
    });
    $("#densityInoutButtonReset").click(function () {
        updateDensityValue("reset");
    });
    $("#densityInoutButtonMinus").click(function () {
        updateDensityValue(-1);
    });
    $("#densityInoutButtonPlus").click(function () {
        updateDensityValue(+1);
    });

    function updateDensityValue(number) {

        if (number == "reset") {
            changeDensityValueAnimation(false);
            densityInput.val(0);
        } else if (number == "max") {
            changeDensityValueAnimation(true);
            densityInput.val(10);
        }
        else {

            changeDensityValueAnimation(Boolean(number > 0));

            if ((parseInt(densityInput.val()) + number) >= 0) {
                if ((parseInt(densityInput.val()) + number) > 10) {
                    densityInput.val(((parseInt(densityInput.val())) + number - 10));
                } else {
                    densityInput.val(((parseInt(densityInput.val())) + number));
                }
            } else {
                densityInput.val(0);
            }
        }

    }

    function updateItemsCountValue(number) {

        if (number == "reset") {
            changeValueAnimation(false);
            itemsCountBlock.val(0);
        } else if (number == "max") {
            changeValueAnimation(true);
            itemsCountBlock.val(MAX_VALUE);
        }
        else {

            changeValueAnimation(Boolean(number > 0));

            if ((parseInt(itemsCountBlock.val()) + number) >= 0) {
                if ((parseInt(itemsCountBlock.val()) + number) > MAX_VALUE) {
                    itemsCountBlock.val(((parseInt(itemsCountBlock.val())) + number - MAX_VALUE));
                } else {
                    itemsCountBlock.val(((parseInt(itemsCountBlock.val())) + number));
                }
            } else {
                itemsCountBlock.val(0);
            }
        }
    }


    function changeValueAnimation(increment) {
        var color = "";
        if (increment) {
            color = "#A8DF8F"
        } else {
            color = "#DF8B81";
        }

        itemsCountBlock.stop();
        itemsCountBlock.animate({
            backgroundColor: color
        }, 300, function () {
            itemsCountBlock.animate({
                backgroundColor: '#f1f1f1'
            }, 200);
        })
    }

    function changeDensityValueAnimation(increment) {
        var color = "";
        if (increment) {
            color = "#A8DF8F"
        } else {
            color = "#DF8B81";
        }

        densityInput.stop();
        densityInput.animate({
            backgroundColor: color
        }, 300, function () {
            densityInput.animate({
                backgroundColor: '#f1f1f1'
            }, 200);
        })
    }


    function getItemsCount() {
        return itemsCountBlock.val();
    }

// END OF COUNTER THINGS


    $("#generateButton").click(function () {
        generate();
    });

    $("#clearButton").click(function () {
        clear();
    });


// LOGIC

    function clear() {
        // $(".inputButton").attr("disabled", false);
        // $(".input").css({
        //     opacity: 1,
        // })
        // $("#output").html("");
        // itemsCountBlock.val(0);
        location.reload();
    }


    function generate() {
        $(".inputButton").attr("disabled", true);
        $(".input").animate({
            opacity: 0.3
        }, 200);

        $("#calculateButton").attr("disabled", false);
        $("#calculateButton").animate({
            opacity: 1
        }, 200);

        $("#generateButton").attr("disabled", true);
        $("#generateButton").animate({
            opacity: 0.3
        }, 200);


        DENSITY = $("#densityInput").val();
        var itemsCount = getItemsCount();
        var itemsArray = [];
        var item;

        var i = 0;
        var j = 0;

        for (i = 0; i < itemsCount; i++) {
            var itemName = "item #" + i;
            var links = [];
            var PR = 0.0;

            item = {
                "name": itemName,
                "rank": PR,
                "links": links,
                "count": 0
            };

            itemsArray.push(item);
        }

        for (i = 0; i < itemsCount; i++) {

            var tmpRand = 0;
            if (DENSITY == 10) {
                tmpRand = itemsCount - 3;
            }
            var randCountOfLinks = DENSITY;//itemsCount * (DENSITY / 100));
            var randomLinkDestination = getRandomInt(tmpRand, itemsCount - 1);
            for (j = 0; j < randCountOfLinks; j++) {
                var link = randomLinkDestination;
                if (link == i) {
                    continue;
                }
                if (itemsArray[i].links.indexOf(link) == -1) {
                    itemsArray[i].links.push(link);
                }
                randomLinkDestination = getRandomInt(0, itemsCount - 1);
            }
        }

        console.log("done");


        function consolePrintItemsArray() {
            console.log("");
            for (i = 0; i < itemsArray.length; i++) {
                var string = itemsArray[i].name + "   c=" + itemsArray[i].count + " \t PR = " + +itemsArray[i].rank + " \t \t";
                for (j = 0; j < itemsArray[i].links.length; j++) {
                    string += itemsArray[i].links[j] + " ";
                }
                console.log(string);
            }
        }


        consolePrintItemsArray();

        calculate();


        function createSigmaJson() {
            var count = getItemsCount();
            var sigmaJson = {
                "nodes": [],
                "edges": []
            };

            var label;
            var xcoord;
            var ycoord;
            var size;


            var angle = (Math.PI * (360 / count)) / 180;
            for (i = 0; i < count; i++) {

                label = "#" + i + " (" + itemsArray[i].count + " in | " + itemsArray[i].links.length + " out)";

                var currentAngle = i * angle;
                xcoord = Math.cos(currentAngle) / 15;
                ycoord = Math.sin(currentAngle) / 15;

                size = itemsArray[i].count;

                var node = {
                    "id": i,
                    "label": label,
                    "x": xcoord,
                    "y": ycoord,
                    "size": size
                };

                sigmaJson.nodes.push(node);


                for (j = 0; j < itemsArray[i].links.length; j++) {

                    var source = i;
                    var target = itemsArray[i].links[j];

                    var edgeId = source + ">" + target;

                    var edge = {
                        "id": edgeId,
                        "source": source,
                        "target": target,
                        "type": 'arrow'
                    };

                    sigmaJson.edges.push(edge);

                }
            }

            return sigmaJson;

        }

        function calculate() {
            for (i = 0; i < itemsArray.length; i++) {
                for (var li = 0; li < itemsArray[i].links.length; li++) {

                    var index = itemsArray[i].links[li];
                    itemsArray[index].rank++;
                    itemsArray[index].count++;


                    // console.log("link from #" + i + " to #" + index + " where new rank is " + itemsArray[index].rank);
                }
            }


            var minRank = 0;
            var maxRank = 0;

            for (i = 0; i < itemsArray.length; i++) {
                if (itemsArray[i].rank > maxRank) maxRank = itemsArray[i].rank;
                if (itemsArray[i].rank < minRank) minRank = itemsArray[i].rank;
            }

            console.log("max rank = " + maxRank + "\nmin rank = " + minRank);

            for (i = 0; i < itemsArray.length; i++) {
                if (itemsArray[i].rank != 0) {
                    itemsArray[i].rank = (100 / getItemsCount()) * itemsArray[i].rank;
                }
            }

            consolePrintItemsArray();
            showResults();

            function showResults() {
                var results = "";
                for (i = 0; i < itemsArray.length; i++) {
                    results += "<p>";
                    results += "<strong>" + itemsArray[i].name + "</strong>" + "<br> Incoming links: " + itemsArray[i].count + "<br> PageRank: " + (itemsArray[i].rank).toFixed(2) + "%    <br> Outgoing links: ";
                    for (j = 0; j < itemsArray[i].links.length; j++) {
                        results += itemsArray[i].links[j] + " ";
                    }
                    results += "<br></p><br>";
                }
                $("#statsResults").html(results);
            }


            createGraph(createSigmaJson());
        }

        function createGraph(dataJson) {


            var s = new sigma({
                graph: dataJson,
                container: 'container',
                type: 'canvas',
                settings: {
                    minArrowSize: 50,
                    verbose: true,
                    defaultEdgeType: 'curvedArrow',
                    rescaleIgnoreSize: true,
                    zoomingRatio: 1.5,
                    labelThreshold: 1,
                    defaultNodeColor: '#2BA4EC'
                }
            });
        }

    }


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


})
;