function GetZipShapes(map) {
    $.LoadingOverlay("show");
    $.ajax({
        type: "POST",
        url: "Map.aspx/GeoJsonShapeByZipCodeByEnterprise",
        //url: "ReportNav.aspx/GetEnterpriseList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            DrawZipCodes(response, map);
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

function GetZipTotalCharges(map) {
    $.LoadingOverlay("show");
    $.ajax({
        type: "POST",
        url: "Map.aspx/GetTop15TotalChargesByZip",
        //url: "ReportNav.aspx/GetEnterpriseList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            DrawZipCodesByTotals(response, map);
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

function GetZipTotalPayments(map) {
    $.LoadingOverlay("show");
    $.ajax({
        type: "POST",
        url: "Map.aspx/GetTop15TotalPaymentsByZip",
        //url: "ReportNav.aspx/GetEnterpriseList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            DrawZipCodesByTotals(response, map);
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}


function DrawZipCodes(response, map) {
    CreateHccCheckBox(response);

    var obj = JSON.parse(response.d);
    var polyShapes = [];
    var zipLables = [];

    var maxPatientCount = GetMaxZipCount(obj);

    document.getElementById('census-min').textContent = '1';
    document.getElementById('census-max').textContent = maxPatientCount.toString();

    $.each(obj, function (i, obj) {

        var centerPointCoordinates = JSON.parse(obj.CenterPoint);
        var geoJson = JSON.parse(obj.GeoCoords);
        var color = obj.Color;
        var zipShapeCoordinates = ((geoJson.coordinates.length) == 1) ? geoJson.coordinates[0] : geoJson.coordinates[0][0];
        var zipShape = [];
        var centerLntLng = new google.maps.LatLng(centerPointCoordinates.coordinates[1], centerPointCoordinates.coordinates[0]);

        //create the label for the zip code
        var mapLabel2 = new MapLabel({
            text: obj.Zip,
            position: centerLntLng, //new google.maps.LatLng(centerPointCoordinates.coordinates[1], centerPointCoordinates.coordinates[0]),
            map: map,
            fontSize: 18,
            align: 'center'
        });

        zipLables.push(mapLabel2);

        var contentString = '<div id="content"><b>Patient Count</b>: ' + obj.ZipCount + '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        //draw each zip code
        $.each(zipShapeCoordinates, function (i, zipShapeCoordinates) {
            zipShape.push(new google.maps.LatLng(zipShapeCoordinates[1], zipShapeCoordinates[0]));
        });

        var poly = new google.maps.Polygon({
            paths: zipShape,
            strokeColor: 'black',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: color,
            fillOpacity: 0.25
        });

        poly.setMap(map);

        polyShapes.push(poly);

        google.maps.event.addListener(poly, 'click', function (event) {
            infowindow.open(map, poly);
            infowindow.setPosition(centerLntLng);
        })

        var percent = obj.ZipCount / maxPatientCount * 100 + '%';

        google.maps.event.addListener(poly, "mouseover", function () {
            document.getElementById('data-caret').style.display = 'block';
            document.getElementById('data-caret').style.paddingLeft = percent;
        });

        google.maps.event.addListener(poly, "mouseout", function () {
            document.getElementById('data-caret').style.display = 'none';
        });

    });

    //$('#hccDropDown').off('selectmenuchange');

    $('#hccDropDown').on('selectmenuchange', function () {
        UpdateMapByHcc(map, polyShapes, zipLables, this.value);
    });

    $.LoadingOverlay("hide");
}

function DrawZipCodesByHcc(response, map) {
    //CreateHccCheckBox(response);
    var obj = JSON.parse(response.d);
    var polyShapes = [];
    var zipLabels = [];

    var maxPatientCount = GetMaxPatientCount(obj);

    document.getElementById('census-min').textContent = '1';
    document.getElementById('census-max').textContent = maxPatientCount.toString();

    $.each(obj, function (i, obj) {

        var centerPointCoordinates = JSON.parse(obj.CenterPoint);
        var geoJson = JSON.parse(obj.GeoCoords);
        var color = obj.Color;
        var zipShapeCoordinates = geoJson.coordinates[0];
        var zipShape = [];
        var centerLntLng = new google.maps.LatLng(centerPointCoordinates.coordinates[1], centerPointCoordinates.coordinates[0]);
        var contentString = '<div id="content"><b>Patient Count</b>: ' + obj.PatientCount + '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        //draw each zip code
        $.each(zipShapeCoordinates, function (i, zipShapeCoordinates) {
            zipShape.push(new google.maps.LatLng(zipShapeCoordinates[1], zipShapeCoordinates[0]));
        });

        var poly = new google.maps.Polygon({
            paths: zipShape,
            strokeColor: 'black',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: color,
            fillOpacity: 0.25,
            zIndex:1
        });

        poly.setMap(map);

        polyShapes.push(poly);

        google.maps.event.addListener(poly, 'click', function (event) {
            infowindow.open(map, poly);
            infowindow.setPosition(centerLntLng);
        })

        //create the label for the zip code
        var mapLabel2 = new MapLabel({
            text: obj.Zip,
            position: centerLntLng, //new google.maps.LatLng(centerPointCoordinates.coordinates[1], centerPointCoordinates.coordinates[0]),
            map: map,
            fontSize: 18,
            align: 'center',
            zIndex: 5
          });

        zipLabels.push(mapLabel2);

        var percent = obj.PatientCount / maxPatientCount * 100 + '%';

        google.maps.event.addListener(poly, "mouseover", function () {
            document.getElementById('data-caret').style.display = 'block';
            document.getElementById('data-caret').style.paddingLeft = percent;
        });

        google.maps.event.addListener(poly, "mouseout", function () {
            document.getElementById('data-caret').style.display = 'none';
        });
    });

    //$('#hccDropDown').tooltip({
    //    content: "Awesome title!"
    //});

    //$('#hccDropDown').off('selectmenuchange');

    $('#hccDropDown').on('selectmenuchange', function () {
        UpdateMapByHcc(map, polyShapes, zipLabels, this.value);
    });

    $.LoadingOverlay("hide");
}

function DrawZipCodesByTotals(response, map) {
    //CreateHccCheckBox(response);
    var obj = JSON.parse(response.d);
    var polyShapes = [];
    var zipLabels = [];

    var maxTotal = GetMaxTotal(obj);

    document.getElementById('census-min').textContent = '1';
    document.getElementById('census-max').textContent = '$' + maxTotal.formatMoney(2, '.', ',');

    $.each(obj, function (i, obj) {

        var centerPointCoordinates = JSON.parse(obj.CenterPoint);
        var geoJson = JSON.parse(obj.GeoCoords);
        var color = obj.Color;
        var zipShapeCoordinates = geoJson.coordinates[0];
        var zipShape = [];
        var centerLntLng = new google.maps.LatLng(centerPointCoordinates.coordinates[1], centerPointCoordinates.coordinates[0]);
        var contentString = '<div id="content"><b>Total $</b>: ' + obj.Total.formatMoney(2,'.',',') + '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        //draw each zip code
        $.each(zipShapeCoordinates, function (i, zipShapeCoordinates) {
            zipShape.push(new google.maps.LatLng(zipShapeCoordinates[1], zipShapeCoordinates[0]));
        });

        var poly = new google.maps.Polygon({
            paths: zipShape,
            strokeColor: 'black',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: color,
            fillOpacity: 0.25,
            zIndex: 1
        });

        poly.setMap(map);

        polyShapes.push(poly);

        google.maps.event.addListener(poly, 'click', function (event) {
            infowindow.open(map, poly);
            infowindow.setPosition(centerLntLng);
        })

        //create the label for the zip code
        var mapLabel2 = new MapLabel({
            text: obj.Zip,
            position: centerLntLng, //new google.maps.LatLng(centerPointCoordinates.coordinates[1], centerPointCoordinates.coordinates[0]),
            map: map,
            fontSize: 18,
            align: 'center',
            zIndex: 5
        });

        zipLabels.push(mapLabel2);

        var percent = obj.Total / maxTotal * 100 + '%';

        google.maps.event.addListener(poly, "mouseover", function () {
            document.getElementById('data-caret').style.display = 'block';
            document.getElementById('data-caret').style.paddingLeft = percent;
        });

        google.maps.event.addListener(poly, "mouseout", function () {
            document.getElementById('data-caret').style.display = 'none';
        });
    });

    //$('#hccDropDown').tooltip({
    //    content: "Awesome title!"
    //});

    //$('#hccDropDown').off('selectmenuchange');

    $('#hccDropDown').on('selectmenuchange', function () {
        UpdateMapByHcc(map, polyShapes, zipLabels, this.value);
    });

    $.LoadingOverlay("hide");
}
function LoadPatientLocationMap(map) {

    var obj;

    $.ajax({
        type: "POST",
        url: "Map.aspx/GetGeoCodes",
        //url: "ReportNav.aspx/GetEnterpriseList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            PopulateCircleMap(response, map);
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

function LoadHccHeatMap(map) {

    var obj;

    $.ajax({
        type: "POST",
        url: "Map.aspx/GetHccByGeoCodes",
        //url: "ReportNav.aspx/GetEnterpriseList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            PopulateHccHeatMap(response, map);
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}


//commenting this next function out - I do not think it is used currently.  Also commenting out the server side function
//function LoadPatientZipHeatMap(map) {

//    var obj;

//    $.ajax({
//        type: "POST",
//        url: "Map.aspx/GetPatientCountGeoCodeByZip",
//        //url: "ReportNav.aspx/GetEnterpriseList",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            PopulatePatientZipHeatMap(response, map);
//        },
//        failure: function (response) {
//            alert(response.d);
//        }
//    });
//}

function PopulatePatientZipHeatMap(response, map) {
    CreateHccCheckBox(response);
    var obj = jQuery.parseJSON(response.d)
    var heatmapData = [];
    var markers = [];

    var pinColor = "42aaf4";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
   new google.maps.Size(21, 34),
   new google.maps.Point(0, 0),
   new google.maps.Point(10, 34));

    $.each(obj, function (i, obj) {
        var contentString = '<div id="content"><b>ZipCode</b>:' + obj.Patient_Zip + ' <br/><b>Patient Count</b>: ' + obj.PatientCount + '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        var latLng = { location: new google.maps.LatLng(obj.latitude, obj.longitude), weight: obj.PatientCount };
        //var latLng = new google.maps.LatLng(obj.latitude, obj.longitude);
        heatmapData.push(latLng);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(obj.latitude, obj.longitude),
            map: map,
            icon: pinImage
        });
        markers.push(marker);

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    });

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
        radius: 140,
        maxIntensity: 20
    });

    document.getElementById('census-min').textContent = '1';
    document.getElementById('census-max').textContent = GetMaxPatientCount(obj);

    $('#hccDropDown').on('selectmenuchange', function () {
        UpdateMapByHcc(map, markers, heatmap, this.value);
    });

    $("#ir").click(function () {
        heatmap.set('radius', heatmap.get('radius') + 10);
    })

    $("#ii").click(function () {
        heatmap.set('maxIntensity', heatmap.get('maxIntensity') + 2);
    })

    $("#dr").click(function () {
        heatmap.set('radius', heatmap.get('radius') - 10);
    })

    $("#di").click(function () {
        heatmap.set('maxIntensity', heatmap.get('maxIntensity') - 2);
    })
}

function GetMax(zipCodes) {
    var max = 0;

    $.each(zipCodes, function (key, zipcode) {
        if (zipcode.Weight > max) max = zipcode.Weight;
    });

    return max;
}

function GetMin(zipCodes) {
    var max = GetMax(zipCodes);
    var min = max;

    $.each(zipCodes, function (key, zipcode) {
        if (zipcode.Weight < min) min = zipcode.Weight;
    });

    return min;
}

function PopulateCircleMap(response, map) {
    var obj = jQuery.parseJSON(response.d)

    var min = GetMin(obj);
    var max = GetMax(obj);

    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
    for (var zip in obj) {
        var low = [151, 83, 34];   // color of mag 1.0
        var high = [5, 69, 54];  // color of mag 6.0 and above
        var min = min;
        var max = max;

        var fraction = (parseFloat(obj[zip].Weight) - min) /
            (max - min);


        var color = [];

        for (var i = 0; i < 3; i++) {
            // Calculate color based on the fraction.
            color[i] = (high[i] - low[i]) * fraction + low[i];
        }

        var circleColor = 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)'

        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 0,
            fillColor: circleColor, //'#FF0000',
            fillOpacity: 0.35, //parseFloat(obj[city].Weight)/396, // 0.35,
            scale: parseInt(obj.length), //Math.pow(obj[city].Weight,2),
            map: map,
            center: { lat: parseFloat(obj[zip].latitude), lng: parseFloat(obj[zip].longitude) },
            radius: Math.sqrt(obj[zip].Weight) * parseInt(obj.length)
        });
    }
}

function CreateHccCheckBox(response) {
    //var entepriseId = '<%= EnterpriseId %>';
    $.ajax({
        type: "POST",
        url: "Map.aspx/GetDistinctHCCByEnterprise",
        //data: JSON.stringify({ "enterpriseId": entepriseId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var obj = jQuery.parseJSON(response.d)
            var hccArray = [];
            $.each(obj, function (i, obj) {
                var checkbox = $('<option value="' + obj.HCC + '">' + obj.HCC + ' (' + obj.HCCCount + ') - ' + obj.DiseaseGroup + '</option>');
                $("#hccDropDown").append(checkbox);
            });
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

function UpdateMapByHcc(map, polyShapes, zipLables, activeHcc) {

    $('#hccDropDown').off('selectmenuchange');
    clearMap(polyShapes, zipLables, map);

    if (activeHcc == 'Patient Population By Zip') {
        GetZipShapes(map);
    }

    else if (activeHcc == 'Top Charge Totals By Zip') {
        GetZipTotalCharges(map); 
    }

    else if (activeHcc == 'Top Payment Totals By Zip') {
        GetZipTotalPayments(map);
    }
    else {
        $.LoadingOverlay("show");

        var label = $('select option:selected')[0].text;
        $('#hcctitle').text(label);

        //$("#hccDropDown-button").attr("title", "").tooltip({
        //    content: function () {
        //        return $('select option:selected')[0].text;
        //    }
        //});


        $.ajax({
            type: "POST",
            url: "Map.aspx/GetPatientCountsByZipByHcc",
            data: JSON.stringify({ "hcc": activeHcc }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //clearMap(polyShapes, zipLables, map);
                DrawZipCodesByHcc(response, map);
            },
            failure: function (response) {
                alert(response.d);
            }
        });
    }
}

function clearMap(polyShapes, zipLables, map) {
    for (var i = 0; i < polyShapes.length; i++) {
        polyShapes[i].setMap(null);
    }
    polyShapes = [];

    for (var i = 0; i < zipLables.length; i++) {
        zipLables[i].setMap(null);
    }
    zipLables = [];
}

function GetMaxPatientCount(obj) {
    var max = 0;

    $.each(obj, function (key, obj) {
        if (obj.PatientCount > max) max = obj.PatientCount;
    });

    return max;
}

function GetMaxTotal(obj) {
    var max = 0;

    $.each(obj, function (key, obj) {
        if (obj.Total > max) max = obj.Total;
    });

    return max;
}

function GetMaxZipCount(obj) {
    var max = 0;

    $.each(obj, function (key, obj) {
        if (obj.ZipCount > max) max = obj.ZipCount;
    });

    return max;
}

//function PopulateHccHeatMap(response, map) {
//    //CreateHccCheckBox(response);
//    var obj = jQuery.parseJSON(response.d)
//    var heatmapData = [];
//    var markers = [];

//    var pinColor = "42aaf4";
//    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor, new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34));

//    var maxPatientCount = GetMaxPatientCount(obj);

//    $.each(obj, function (i, obj) {
//        var contentString = '<div id="content"><b>Zip Code:</b> ' + obj.Patient_Zip + '<br/><b>Patient Count:</b> ' + obj.PatientCount + '</div>';
//        var infowindow = new google.maps.InfoWindow({
//            content: contentString
//        });

//        var latLng = { location: new google.maps.LatLng(obj.latitude, obj.longitude), weight: obj.PatientCount };
//        //var latLng = new google.maps.LatLng(obj.latitude, obj.longitude);
//        heatmapData.push(latLng);
//        var marker = new google.maps.Marker({
//            position: new google.maps.LatLng(obj.latitude, obj.longitude),
//            map: map,
//            icon: pinImage
//        });

//        markers.push(marker);

//        marker.addListener('click', function () {
//            infowindow.open(map, marker);
//        });
//    });

//    var heatmap = new google.maps.visualization.HeatmapLayer({
//        data: heatmapData,
//        map: map,
//        radius: Math.sqrt(maxPatientCount) * parseInt(obj.length) * 50,
//        maxIntensity: maxPatientCount
//    });

//    document.getElementById('census-min').textContent = '1';
//    document.getElementById('census-max').textContent = maxPatientCount.toString();


//    //alert('radius: ' + Math.sqrt(maxPatientCount) * parseInt(obj.length));
//    //alert('maxIntesity: ' + maxPatientCount);

//    $('#hccDropDown').off('selectmenuchange');

//    $('#hccDropDown').on('selectmenuchange', function () {
//        UpdateMapByHcc(map, markers, heatmap, this.value);
//    });

//    $("#ir").click(function () {
//        heatmap.set('radius', heatmap.get('radius') + 10);
//    })

//    $("#ii").click(function () {
//        heatmap.set('maxIntensity', heatmap.get('maxIntensity') + 2);
//    })
//}


function addListenerToMarker(map, content) {
    //content variable being passed in could be string or HTML - creating a sample value below (contentString)
    var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">Signature Health</h1>' +
            '<div id="bodyContent">' +
            '<p><b>Signature Health</b>, does some medical stuff.</p>' +
            '<p>Red = a lot</p>' +
            '<p>Green = not a lot' +
            '<table>' +
            '<tr><td><b>Zip</b></td><td><b>Coun</b>t</td></tr>' +
            '<tr><td>55574</td><td>88</td></tr>' +
            '<tr><td>33456</td><td>4</td></tr>' +
            '<tr><td>33211</td><td>332</td></tr>' +
            '</table>' +
            '</div>' +
            '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(35.147975, -80.841130),
        map: map,
        draggable: true
    });

    $(item).addListener('click', function () {
        infowindow.open(map, marker);
    });
}

//function increaseRadius(item) {
//    $(item).click(function () {
//        heatmap.set('radius', heatmap.get('radius') + 1);
//    });
//}

//function decreaseRadius(item) {
//    $(item).click(function () {
//        heatmap.set('radius', heatmap.get('radius') - 1);
//    });
//}

//function increaseIntensity(item) {
//    $(item).click(function () {
//        heatmap.set('intensity', heatmap.get('intensity') + 1);
//    });
//}

//function decreaseIntensity(item) {
//    $(item).click(function () {
//        heatmap.set('intensity', heatmap.get('intensity') - 1);
//    });
//}

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};