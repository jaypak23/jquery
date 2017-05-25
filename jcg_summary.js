function SetDataSourceChart1() {
    source = {
        datatype: "xml",
        datafields: [
        { name: 'FinancialClass' },
        { name: 'Charges', type: 'number' }
        ],
        async: false,
        record: 'Table',
        url: 'JQWidgets.aspx/GetPayerMix'
    };
    var dataAdapter = new $.jqx.dataAdapter(source,
        { contentType: 'application/json; charset=utf-8' }
    );

    var chart1 = $('#chart1Container').jqxChart({ source: dataAdapter });
}

function InitializeChart1() {

    var settings = {
        title: "Payer Mix",
        description: "Percentage of Charges by Financial Class",
        enableAnimations: true,
        showLegend: true,
        showBorderLine: true,
        legendLayout: { left: 0, top: 260, width: '100%', height: 40, flow: 'horizontal' },
        padding: { left: 0, top: 0, right: 0, bottom: 70 },
        titlePadding: { left: 0, top: 0, right: 0, bottom: 0 },
        colorScheme: 'scheme03',
        seriesGroups:
            [
                {
                    type: 'pie',
                    showLabels: false,
                    toolTipFormatSettings: {
                        prefix: '$', decimalPlaces: 2, decimalSeparator: '.',
                        thousandsSeparator: ',', negativeWithBrackets: true
                    },
                    series:
    [
        {

            dataField: 'Charges',
            decimalPlaces: 0,
            displayText: 'FinancialClass',
            labelRadius: 170,
            initialAngle: 15,
            radius: 105,
            centerOffset: 0,

            formatFunction: function (value) {
                if (isNaN(value))
                    return value;
                return parseFloat(value);
            },
        }
    ]

                }
            ]

    };

    // setup the chart
    $('#chart1Container').jqxChart(settings);
};


function SetDataSourceChart2() {
    source = {
        datatype: "xml",
        datafields: [
        { name: 'ReportWeek' },
        { name: 'DOS_Charges', type: 'number' },
        { name: 'DOE_Charges', type: 'number' },
        { name: 'Adjustments', type: 'number' },
        { name: 'Payments', type: 'number' }
        ],
        async: false,
        record: 'Table',
        url: 'JQWidgets.aspx/GetCPA'
    };
    var dataAdapter = new $.jqx.dataAdapter(source,
        { contentType: 'application/json; charset=utf-8' }
    );
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    $('#chart2Container').jqxChart({ source: dataAdapter });
}

function InitializeChart2() {
    
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // prepare jqxChart settings
    var settings = {
        title: "Weekly Totals",
        description: "Charges, Payments and Adjustments",
        enableAnimations: true,
        showLegend: true,
        enableCrosshairs: true,
        crosshairsDashStyle: '2,2',
        crosshairsLineWidth: 1.0,
        crosshairsColor: '#888888',
        padding: { left: 5, top: 5, right: 5, bottom: 5 },
        titlePadding: { left: 0, top: 0, right: 0, bottom: 0 },
        //source: dataAdapter,
        colorScheme: 'scheme05',
        borderLineColor: '#888888',
        xAxis:
        {
            dataField: 'ReportWeek',
            type: 'date',
            unitInterval: 7,
            baseUnit: 'day',
            labels:
        {
            angle: -45,
            rotationPoint: 'topright',
            offset: { x: 0, y: -25 },
            formatFunction: function (value) {
                return value.getDate() + '-' + months[value.getMonth()] + '-' + value.getFullYear();
            }
        }
        },
        valueAxis:
        {
            visible: true,
            minValue: 0,
            title: { text: '$ by week' },
            tickMarks: { color: '#888888' },
            gridLines: { color: '#888888' },
            axisSize: 'auto'
        },

        seriesGroups:
            [
                {
                    type: 'splinearea',
                    series: [
                        {
                            dataField: 'DOE_Charges',
                            displayText: 'Charges (DOE)',
                            opacity: 0.7,
                            toolTipFormatFunction: function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                                return '<b>' + serie.displayText + ':</b> $' + numberWithCommas(value);
                            }
                        }


                    ]
                },
                 {
                     type: 'spline',
                     series: [
                             {
                                 dataField: 'DOS_Charges', displayText: 'Charges (DOS)', opacity: 0.7, toolTipFormatFunction: function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                                     return '<b>' + serie.displayText + ':</b> $' + numberWithCommas(value);
                                 }
                             }
                     ]
                 },
                {
                    type: 'stackedcolumn',
                    columnsGapPercent: 25,
                    columnsMinWidth: 15,
                    columnsMaxWidth: 30,
                    seriesGapPercent: 25,
                    series: [
                            {
                                dataField: 'Payments', displayText: 'Payments', toolTipFormatFunction: function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                                    return '<b>' + serie.displayText + ':</b> $' + numberWithCommas(value);
                                },
                            },
                            {
                                dataField: 'Adjustments', displayText: 'Adjustments', toolTipFormatFunction: function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                                    return '<b>' + serie.displayText + ':</b> $' + numberWithCommas(value);
                                }
                            }
                    ]
                }

            ]
    };



    //// setup the chart
    $('#chart2Container').jqxChart(settings);

};

function SetDataSourceChart3() {

    source = {
        datatype: "xml",
        datafields: [
        { name: 'ReportWeek' },
        { name: 'DaysToEnter', type: 'number' },
        ],
        async: false,
        record: 'Table',
        url: 'JQWidgets.aspx/GetWeeklyDaysToEnter'
    };
    var dataAdapter = new $.jqx.dataAdapter(source,
        { contentType: 'application/json; charset=utf-8' }
    );

    $('#chart3Container').jqxChart({ source: dataAdapter });
}

function InitializeChart3() {
   
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // prepare jqxChart settings
    var settings = {
        title: "Weekly Days to Enter Charges",
        description: "Average days to Enter Charges from DOS",
        enableAnimations: true,
        showLegend: false,
        enableCrosshairs: true,
        crosshairsDashStyle: '2,2',
        crosshairsLineWidth: 1.0,
        crosshairsColor: '#888888',
        padding: { left: 5, top: 5, right: 5, bottom: 5 },
        titlePadding: { left: 0, top: 0, right: 0, bottom: 10 },
        //source: dataAdapter,
        colorScheme: 'scheme05',
        borderLineColor: '#888888',
        xAxis:
                {
                    dataField: 'ReportWeek',
                    symbolType: 'square',
                    labels:
                    {
                        visible: true,
                        backgroundColor: '#FEFEFE',
                        backgroundOpacity: 0.2,
                        borderColor: '#7FC4EF',
                        borderOpacity: 0.7,
                        padding: { left: 5, right: 5, top: 0, bottom: 0 }
                    },
                    formatFunction: function (value) {
                        return value.getDate() + '-' + months[value.getMonth()] + '-' + value.getFullYear();
                    },
                    type: 'date',
                    baseUnit: 'day',
                    valuesOnTicks: true,
                    unitInterval: 7,
                    tickMarks: {
                        visible: true,
                        interval: 7,
                        color: '#BCBCBC'
                    },
                    gridLines: {
                        visible: true,
                        interval: 7,
                        color: '#BCBCBC'
                    },
                    labels: {
                        angle: -45,
                        rotationPoint: 'topright',
                        offset: { x: 0, y: -25 }
                    }
                },
        valueAxis:
        {
            visible: true,
            title: { text: 'Days<br>' },
            minValue: 0,
            tickMarks: { color: '#BCBCBC' }

        },
        colorScheme: 'scheme04',
        seriesGroups:
            [
                {
                    type: 'line',
                    series: [
                            { dataField: 'DaysToEnter', displayText: '' }
                    ]
                }
            ]
    };
    //// setup the chart
    $('#chart3Container').jqxChart(settings);
};

function SetDataSourceChart4() {
    source = {
        datatype: "xml",
        datafields: [
        //{ name: 'FinancialClass' },
        { name:'ReportDate'},
        { name:'DOS_Charges', type: 'number'},
        { name:'DOE_Charges', type: 'number'}
        ],
        async: false,
        record: 'Table',
        sortcolumn: 'ReportNumber',
        sortdirection: 'asc',
        url: 'JQWidgets.aspx/GetDailyCharges'
        
    };

    var dataAdapter = new $.jqx.dataAdapter(source,
        { contentType: 'application/json; charset=utf-8' }
    );

    $('#chart4Container').jqxChart({ source: dataAdapter });
}

function InitializeChart4() {
    $.jqx._jqxChart.prototype.colorSchemes.push({ name: 'myScheme', colors: ['#ffff00','#ff0000','#ccff00','#00ffff','#aaaaaa']});

    var toolTipCustomFormatFn = function (value, itemIndex, serie, group, categoryValue, categoryAxis) {
        var dataItem = dataAdapter.records[itemIndex];
        return '<DIV style="text-align:left"><b>' + dataAdapter.displayText['DOS Charges'] + '</b>' +
                dataAdapter.formatNumber(dataItem['DOS_Charges'], 'f') + '</DIV>';
    };
    // prepare jqxChart settings
    var settings = {
        title: "Daily Charges",
        description: "Total Charges within 2 weeks of DOS",
        enableAnimations: true,
        showLegend: true,
        enableCrosshairs: true,
        crosshairsDashStyle: '2,2',
        crosshairsLineWidth: 1.0,
        crosshairsColor: '#888888',
        padding: { left: 5, top: 5, right: 5, bottom: 5 },
        titlePadding: { left: 0, top: 0, right: 0, bottom: 10 },
        colorScheme: 'scheme05',
        borderLineColor: '#888888',
        xAxis:
                {
                    dataField: 'ReportDate',
                    valuesOnTicks: true,
                    type: 'basic',
                   // unitInterval: 1,
                    tickMarks: {
                        visible: true,
                        interval: 1,
                        color: '#BCBCBC'
                    },
                    gridLines: {
                        visible: true,
                        interval: 1,
                        color: '#BCBCBC'
                    },
                    labels: {
                        angle: -45,
                        rotationPoint: 'topright',
                        offset: { x: 0, y: -25 }
                    }
                },
        valueAxis:
        {
            visible: true,
            title: { text: 'Charges<br>' },
            minValue: 0,
            tickMarks: { color: '#BCBCBC' }
        },
        colorScheme: 'scheme04',
        seriesGroups:
            [
                {
                    type: 'line',
                    series: [
                            { dataField: 'DOS_Charges', displayText: 'Charges (DOS)' },
                            { dataField: 'DOE_Charges', displayText: 'Charges (DOE)' }
                    ]
                }
            ]
    };

    // setup the chart
    $('#chart4Container').jqxChart(settings);
};


function loadChart5() {
    source = {
        datatype: "xml",
        datafields: [
        { name: 'FinancialClass' },
        { name: 'Charges', type: 'number' },
        ],
        async: false,
        record: 'Table',
        url: 'JQWidgets.aspx/GetProviders'
    };
    var dataAdapter = new $.jqx.dataAdapter(source,
        { contentType: 'application/json; charset=utf-8' }
    );
    // var dataAdapter = new $.jqx.dataAdapter(source, { async: false, autoBind: true, loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); } });
    $.jqx._jqxChart.prototype.colorSchemes.push({ name: 'myScheme', colors: ['#ffff00', '#ff0000', '#ccff00', '#00ffff', '#aaaaaa'] });

    var toolTipCustomFormatFn = function (value, itemIndex, serie, group, categoryValue, categoryAxis) {
        var dataItem = dataAdapter.records[itemIndex];
        return '<DIV style="text-align:left"><b>' + dataAdapter.displayText['FinancialClass'] + '</b>' +
                dataAdapter.formatNumber(dataItem['Charges'], 'f') + '</DIV>';
    };
    // prepare jqxChart settings
    var settings = {
        title: "Payer Mix",
        description: "Percentage of Charge by Financial Class",
        enableAnimations: true,
        showLegend: true,
        showBorderLine: true,
        legendLayout: { left: 0, top: 50, width: 200, height: 300, flow: 'vertical' },
        padding: { left: 150, top: 5, right: 5, bottom: 5 },
        titlePadding: { left: -150, top: 0, right: 0, bottom: 10 },
        source: dataAdapter,
        colorScheme: 'scheme03',
        seriesGroups:
            [
                {
                    type: 'pie',
                    showLabels: false,
                    series:
                        [
                            {
                                dataField: 'Charges',
                                displayText: 'FinancialClass',
                                labelRadius: 170,
                                initialAngle: 15,
                                radius: 105,
                                centerOffset: 0,
                                //toolTipFormatSettings: {
                                //    sufix: '',
                                //    prefix: '$',
                                //    decimalPlaces: 2,
                                //    decimalSeparator: '.',
                                //    negativeWithBrackets: true
                                //},
                                formatSettings:
                        {
                            decimalPlaces: 2,
                            thousandsSeparator: true
                        },

                                toolTipFormatFunction: function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                                    return '<b>' + serie.displayText + ':</b> $' + numberWithCommas(value);
                                },

                                formatFunction: function (value) {
                                    if (isNaN(value))
                                        return value;
                                    return parseFloat(value);
                                },
                            }
                        ]
                }
            ]

    };

    // setup the chart
    $('#chart5Container').jqxChart(settings);
};


function loadChart6() {
    source = {
        datatype: "xml",
        datafields: [
        { name: 'FinancialClass' },
        { name: 'Charges', type: 'number' },
        ],
        async: false,
        record: 'Table',
        url: 'JQWidgets.aspx/GetProviders'
    };
    var dataAdapter = new $.jqx.dataAdapter(source,
        { contentType: 'application/json; charset=utf-8' }
    );
    // var dataAdapter = new $.jqx.dataAdapter(source, { async: false, autoBind: true, loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); } });
    $.jqx._jqxChart.prototype.colorSchemes.push({ name: 'myScheme', colors: ['#ffff00', '#ff0000', '#ccff00', '#00ffff', '#aaaaaa'] });

    var toolTipCustomFormatFn = function (value, itemIndex, serie, group, categoryValue, categoryAxis) {
        var dataItem = dataAdapter.records[itemIndex];
        return '<DIV style="text-align:left"><b>' + dataAdapter.displayText['FinancialClass'] + '</b>' +
                dataAdapter.formatNumber(dataItem['Charges'], 'f') + '</DIV>';
    };
    // prepare jqxChart settings
    var settings = {
        title: "Payer Mix",
        description: "Percentage of Charge by Financial Class",
        enableAnimations: true,
        showLegend: true,
        showBorderLine: true,
        legendLayout: { left: 700, top: 160, width: 200, height: 200, flow: 'vertical' },
        padding: { left: 5, top: 5, right: 5, bottom: 5 },
        titlePadding: { left: 0, top: 0, right: 0, bottom: 10 },
        source: dataAdapter,
        colorScheme: 'scheme03',
        seriesGroups:
            [
                {
                    type: 'pie',
                    showLabels: false,
                    series:
                        [
                            {
                                dataField: 'Charges',
                                displayText: 'FinancialClass',
                                labelRadius: 170,
                                initialAngle: 15,
                                radius: 105,
                                centerOffset: 0,
                                //toolTipFormatSettings: {
                                //    sufix: '',
                                //    prefix: '$',
                                //    decimalPlaces: 2,
                                //    decimalSeparator: '.',
                                //    negativeWithBrackets: true
                                //},
                                formatSettings:
                        {
                            decimalPlaces: 2,
                            thousandsSeparator: true
                        },

                                toolTipFormatFunction: function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                                    return '<b>' + serie.displayText + ':</b> $' + numberWithCommas(value);
                                },

                                formatFunction: function (value) {
                                    if (isNaN(value))
                                        return value;
                                    return parseFloat(value);
                                },
                            }
                        ]
                }
            ]

    };

    // setup the chart
    $('#chart6Container').jqxChart(settings);
};

function numberWithCommas(n) {
    var parts = n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
};

function loadBarGraph() {
    source = {
        datatype: "xml",
        datafields: [
        { name: 'FinancialClass' },
        { name: 'Charges', type: 'number' }
        ],
        async: false,
        record: 'Table',
        url: 'JQWidgets.aspx/GetPayerMix'
    };
    var dataAdapter = new $.jqx.dataAdapter(source,
        { contentType: 'application/json; charset=utf-8' }
    );
    // var dataAdapter = new $.jqx.dataAdapter(source, { async: false, autoBind: true, loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); } });
    // $.jqx._jqxChart.prototype.colorSchemes.push({ name: 'myScheme', colors: ['#ffff00', '#ff0000', '#ccff00', '#00ffff', '#aaaaaa'] });

    //};

    var settings = {
        title: "Payer Mix",
        description: "Percentage of Charges by Financial Class",
        enableAnimations: true,
        showLegend: true,
        showBorderLine: true,
        legendLayout: { left: 0, top: 260, width: '100%', height: 40, flow: 'horizontal' },
        padding: { left: 0, top: 0, right: 0, bottom: 70 },
        titlePadding: { left: 0, top: 0, right: 0, bottom: 0 },
        source: dataAdapter,
        colorScheme: 'scheme03',
        seriesGroups:
            [
                {
                    type: 'column',
                    showLabels: false,
                    toolTipFormatSettings: {
                        prefix: '$', decimalPlaces: 2, decimalSeparator: '.',
                        thousandsSeparator: ',', negativeWithBrackets: true
                    },
                    series:
    [
        {

            dataField: 'Charges',
            //  formatSettings: 

            decimalPlaces: 0,
            displayText: 'FinancialClass',
            labelRadius: 170,
            initialAngle: 15,
            radius: 105,
            centerOffset: 0,

            formatFunction: function (value) {
                if (isNaN(value))
                    return value;
                return parseFloat(value);
            },
        }
    ]

                }
            ]

    };

    // setup the chart
    $('#barGraph').jqxChart(settings);
    //  $('#chart4Container').jqxChart(settings);
};