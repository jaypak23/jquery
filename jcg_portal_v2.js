/// <reference path="C:\sourceCode\Dev\ClientPortal\ClientPortal\Report.aspx" />
/// <reference path="C:\sourceCode\Dev\ClientPortal\ClientPortal\Report.aspx" />
//Gets the list of Enterprises in order to populate the drop down on the side nav bar
function GetClients(activeClient) {
    $.ajax({
        type: "POST",
        url: "ReportNav.aspx/GetEnterpriseList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            SetupClientList(response, activeClient);
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

//Iterates over the data and populates the enterprise drop down list on the side bar nav
function SetupClientList(response, activeClient) {
    var count = 1;
    var obj = jQuery.parseJSON(response.d)
    var tileString;
    var enterpriseGroup = null;
    var seperatorAdded = false;
    $.each(obj, function (i, obj) {
        if (obj.Assessment == 1 & !seperatorAdded)
        {
            $("#enterpriseDropDown").append('<li role="separator" class="divider"></li>');
            seperatorAdded = true;
        }
        $("#enterpriseDropDown").append('<li><a id=' + obj.Enterprise_Id + ' href="#">' + obj.Name + '</a></li>');
    });

    var activeEnterprise = obj.filter(function (e) {
        return e.Enterprise_Id == activeClient;
    });

    $('#enterpriseDropDown li').click(function (e) {
        var activeEnterpriseName = $(this).text();
        ChangeEnterprise(e.target.id, activeEnterpriseName);
    });

    ChangeEnterprise(activeClient, activeEnterprise[0].Name);
}

//Gets a list of all enterprise based on security.
function GetEnterprises() {
    $.ajax({
        type: "POST",
        url: "default.aspx/GetEnterpriseList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            SetupPage(response);
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

//Iterates over the json data and sets up the page with list of enterprises
function SetupPage(response) {
    var count = 1;
    var obj = jQuery.parseJSON(response.d)
    var tileString;
    var enterpriseGroup = null;
    //<div class="' + alertLevel + '"> \
    $.each(obj, function (i, obj) {
        var alertLevel = GetAlertLevel(obj.Color);
        var div = '<div class="col-lg-3 col-md-6"> \
            <div class="equal-height-panels panel ' + alertLevel + '">\
                <div class="panel-heading">\
                    <div class="row" style="text-align: center;">\
                        <img src="img/EnterpriseThumbs/' + obj.LogoId + '.jpg" alt="report1" id="report4" style="width: 95%; border: 2px solid black" />\
                    </div>\
                </div>\
                <a href="ReportNav.aspx?eid=' + obj.Enterprise_Id + '">\
                    <div class="panel-footer"><span class="pull-left">' + obj.Name +'</span>                                <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>\
                        <div class="clearfix"></div>\
                    </div>\
                </a></div>';
        if (i % 4 == 0) {
            $('#mainContainer').append('<div class="row">');
        }
        $('#mainContainer').append(div);
        $(".altsrc").on("error", function () {
            $(this).attr('src', 'img/EnterpriseThumbs/0.jpg');
        });
    });
}

//fires whenever the enterprise list drop down changes
function ChangeEnterprise(activeClient, enterpriseName) {
    sessionStorage['EnterpriseName'] = enterpriseName;
    sessionStorage['EnterpriseId'] = activeClient;
    //$('#EnterpriseName')[0].innerHTML = enterpriseName;
    $.ajax({
        type: "POST",
        data: JSON.stringify({ "enterpriseId": activeClient }),
        url: "ReportNav.aspx/GetReportsMenuByEnterprise",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            GetReportsMenuByEnterprise(response);
        },
        failure: function (response) {
            //alert('It Crapped Out!');
        }
    });

    $('#dropDownText').text('');
    $('#dropDownText').append('<b>Enterprise Name: </b> ' + enterpriseName + '<span class="caret"></span>');

    clearReportList();
    $("#summary-dashboard").show();
    $("#report-parent-summary").css("background-color", "#140f4a");
    $("#report-parent-summary a").addClass("activelink");
}

//Create the menu of report categories based on the enterprise id
function GetReportsMenuByEnterprise(response) {
    var obj = jQuery.parseJSON(response.d)
    var reportType;
    var linkId;
    var reportList;
    var navbar = $("#side-menu ul");

    //$("#side-menu ul").effect("explode", { percent: 50 }, 500);

    $.each($("#side-menu ul li"), function (i) {
        if ($(this)[0].id != "searchbar" && $(this)[0].id != "clientListLink") {
            $(this).remove();
        }
    });

    var li = $("<li id='report-parent-summary'></li>");
    li.append('<a id="summary" style=font-family:Tahoma;"><i class="fa fa-fw fa-tachometer" ></i>Summary</a>');
    li.css('cursor', 'pointer');
    li.appendTo(navbar);
    li.click(function () {
        ShowDashboard($(this));
    });

    $.each(obj, function (i, obj) {
        var li = $("<li id='report-parent-" + obj.MenuID + "'></li>");
        li.append('<a id=' + obj.MenuID + ' style="border-right: 8px solid ' + obj.AlertColor + ';font-family:Tahoma;"><i class="fa fa-fw fa-' + obj.Icon + '" ></i>' + obj.MenuName + '</a>');
        li.css('cursor', 'pointer');
        li.appendTo(navbar);
        li.click(function () {
            GetReportsByenterpriseByParentType($(this))
        });
    });

    var li = $("<li></li>");
    li.append('<a href="./Map.aspx" target="_blank"><i class="fa fa-fw fa-tachometer" ></i>Map</a>');
    li.css('cursor', 'pointer');
    li.appendTo(navbar);

    //var li = $("<li></li>");
    //li.append('<a><i class="fa fa-fw fa-tachometer" ></i>Manage KPI</a>');
    //li.css('cursor', 'pointer');
    //li.appendTo(navbar);
    //li.click(function () {
    //    GetKPIs($(this))
    //});
  
    UpdateDashboard();
}

function ShowDashboard(item) {
    //GetDashboard();
    clearReportList();
    clearActiveLink(item[0]);
    $("#summary-dashboard").show();
    $("#report-parent-summary").css("background-color", "#140f4a");
    $("#report-parent-summary a").addClass("activelink");
}

function GetKPIs(item) {
    $("#summary-dashboard").hide();
    $("#reportsList").hide();
    //$.ajax({
    //    type: "POST",
    //    data: JSON.stringify({ "enterpriseId": localStorage['EnterpriseId'] }),
    //    url: "ReportNav.aspx/GetKPIbyEnterprise",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (response) {
    //        SetupKPIList(response);
    //    },
    //    failure: function (response) {
    //        alert(response.d);
    //    }
    //});

    var source =
           {
               datatype: "xml",
               datafields: [
                   { name: 'Name', type: 'string' },
                   { name: 'LowerRange', type: 'float' },
                   { name: 'UpperRange', type: 'float' },
               ],
               async: false,
               record: 'Table',
               url: 'ReportNav.aspx/GetKPIbyEnterprise'
           };
   
    var dataAdapter = new $.jqx.dataAdapter(source,
         { contentType: 'application/json; charset=utf-8' }
     );

    // initialize jqxGrid
    $("#kpiManagement").jqxGrid(
    {
        width: '100%',
        source: dataAdapter,
        //pageable: true,
        autoheight: true,
        //sortable: true,
        altrows: true,
        enabletooltips: true,
        editable: true,
        //selectionmode: 'multiplecellsadvanced',
        columns: [
          { text: 'Name', datafield: 'Name', width: '50%' },
          { text: 'LowerRange', datafield: 'LowerRange', cellsalign: 'right', align: 'right', width: '25%' },
          { text: 'UpperRange', datafield: 'UpperRange', align: 'right', cellsalign: 'right', width: '25%' }
        ],
        //columngroups: [
        //    { text: 'Product Details', align: 'center', name: 'ProductDetails' }
        //]
    });
}

//Sets up the report display based on what the user clicks on the menu
function SetupKPIList(response) {
    clearReportList();
    var obj = jQuery.parseJSON(response.d);
    var kpiTable = '<table>'
    $.each(obj, function (i, obj) {
        var kpirow = '<tr> \
                    <td>' + obj.Name + '</td> \
                    <td>Lower Range</td> \
                    <td> \
                        <input type="text" value="' + obj.LowerRange + '"/></td> \
                    <td>Upper Range</td> \
                    <td> \
\                        <input type="text" value="' + obj.UpperRange + '"/></td> \
                </tr>';
        kpiTable = kpiTable + kpirow;
    });
    kpiTable = kpiTable + '</table>'

    $(kpiTable).hide().appendTo("#kpiManagement").fadeIn(300);

    var button = '<input type="button" value="Update!" />';
    $(button).hide().appendTo("#kpiManagement").fadeIn(300);

    $('[data-toggle="tooltip"]').tooltip();

    $("#kpiManagement").show();
}

//Gets a list of reports for by enterprise id by parent item (report type)
function GetReportsByenterpriseByParentType(item) {
    $("#summary-dashboard").hide();
    var reportParent = item[0].id.substring(14, item[0].id.length);
    clearActiveLink(item[0]);
    item.css("background-color", "#140f4a")
    $('#' + reportParent).addClass("activelink");
    $.ajax({
        type: "POST",
        data: JSON.stringify({ "enterpriseId": sessionStorage['EnterpriseId'], "reportParent": reportParent }),
        url: "ReportNav.aspx/GetReportsByenterpriseByParentType",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            SetupReportList(response, item[0].innerText);
        },
        failure: function (response) {
            alert(response.d);
        }
    });
}

function UpdateDashboard() {
   
    SetDataSourceChart1();
    SetDataSourceChart2();
    SetDataSourceChart3();
    SetDataSourceChart4();
    //loadBarGraph();
}

function InitializeDashboard() {
    var dashboardTemplate = '<div class="row">\
           <div class="col-lg-5">\
               <div id="chart1Container" style="width: 100%; height: 340px; float: left;"></div>\
           </div>\
           <div class="col-lg-7">\
               <div id="chart2Container" style="width: 100%; height: 340px; float: left;"></div>\
           </div>\
       </div>\
       <div class="row">\
           <div class="col-lg-2"></div>\
           <div class="col-lg-4">\
               <div id="chart3Container" style="width: 100%; height: 275px;"></div>\
           </div>\
           <div class="col-lg-4">\
               <div id="chart4Container" style="width: 100%; height: 275px;"></div>\
        <div class="col-lg-2"></div>\
       </div>';

    $(dashboardTemplate).appendTo("#summary-dashboard");

    InitializeChart1();
    InitializeChart2();
    InitializeChart3();
    InitializeChart4();
    //loadBarGraph();
}

//Sets up the report display based on what the user clicks on the menu
function SetupReportList(response, breadcrumb) {
    clearReportList();
    var obj = jQuery.parseJSON(response.d);
    $.each(obj, function (i, obj) {
        var URL = obj.URL;
        var panelClass = GetAlertLevel(obj.AlertColor);
        var reportTile = GetReportTileTemplate(panelClass, obj.Title, obj.Description, obj.URLType, obj.ReportName, breadcrumb)
        $(reportTile).hide().appendTo("#reportsList").fadeIn(300);
    });

    $('[data-toggle="tooltip"]').tooltip();
    //$("#bc li").remove();
    //var bc = '<li class="breadcrumb-item active">' + breadcrumb + '</li>';
    //$(bc).appendTo("#bc").fadeIn(300);
    //$("#mydiv").hide();
    $("#reportsList").show();
}

function clearReportList() {
    $.each($("#reportsList div"), function (i) {
        $(this).remove();
    });
}
//TODO:  This is looking at entire DOM to remove - should be able to be more specific
function clearActiveLink() {

    $("li").each(function (index, Element) {
        $(this).css("background-color", "transparent");
    });

    $("a").each(function (index, Element) {
        $(this).removeClass("activelink");
    });
}

////Gets a list of all enterprise based on security.
//function GetCurrentUser() {
//    $.ajax({
//        type: "POST",
//        url: "default.aspx/GetCurrentUser",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            $('#username').innerHTML = response.d;
//        },
//        failure: function (response) {
//            alert(response.d);
//        }
//    });
//}

function GetAlertLevel(alertColor) {
    var panelColor;
    switch (alertColor) {
        case "#2d5371":
            panelColor = "panel panel-primary";
            break;
        case "#5cb85c":
            panelColor = "panel panel-green";
            break;
        case "#ffff00":
            panelColor = "panel panel-yellow";
            break;
        case "#cc0000":
            panelColor = "panel panel-red";
            break;
    }

    return panelColor;
}

function GetReportTileTemplate(panelClass, title, description, reportType, ReportName, breadcrumb) {

    var reportTileTemplate = '<div class="col-lg-3 col-md-6"> \
                                <div class="equal-height-panels panel ' + panelClass + '"> \
                                    <div class="panel-heading"> \
                                        <div class="row" style="text-align:center;">\
                                            <img src="img/ReportThumbs/' + title + '.jpg" alt="report1" id="report4" style="width:95%;border:2px solid black" />\
                                        </div>\
                                    </div>';
    if (reportType == "Report") {
        reportTileTemplate = reportTileTemplate + '<a data-toggle="tooltip" title="' + description + '" href="./Report.aspx?ReportName=' + ReportName + '" target="_blank";">';
    }
    else {
        reportTileTemplate = reportTileTemplate + '<a  data-toggle="tooltip" title="' + description + '" href="' + URL + '" target="_blank">'
    };
    reportTileTemplate = reportTileTemplate + '<div class="panel-footer">\
                                <span class="pull-left">' + title + '</span>\
                                <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>\
                                <div class="clearfix"></div>\
                            </div>\
                        </a> \
                    </div>';

    return reportTileTemplate;
}

//function MyFunction(reportname, breadcrumb) {
//    $("#mydiv").show();
//    //$("#mydiv").html('<object style="width:100%;height:80vh" data="https://client.jcgriffin.com/ReportServer/Pages/ReportViewer.aspx?%2fGriffin/' + reportname + '&rs:Command=Render&rc:Toolbar=True&Enterprise_ID=67"/>');
//    $("#mydiv").html('<object style="width:100%;height:80vh" data="Report.aspx?ReportName=' + reportname + '"/>');
//    $("#bc li").remove();
//    var bc = '<li class="breadcrumb-item">' + breadcrumb + '</li><li class="breadcrumb-item active">' + reportname + '</li>';
//    $(bc).appendTo("#bc").fadeIn(300);
//    $("#reportsList").hide();
//    $("#summary-dashboard").hide();
//    $("#kpiManagement").hide();
//    return false;
//}

