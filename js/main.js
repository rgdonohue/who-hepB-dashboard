(function(Chart, $){

    var birthYearIntervals = {
        'births-1980-1985': [1980, 1985],
        'births-1985-1990': [1986, 1990],
        'births-1980-1985': [1991, 1995],
        'births-1985-1990': [1996, 2000],
        'births-1980-1985': [2001, 2005],
        'births-1985-1990': [2006, 2010],
        'births-1980-1985': [2011, 2015],
    };

    var infantMortalityIntervals = {
        'InfMort1985-1990': [1985, 1990],
        'InfMort1990-1995': [1991, 1995],
        'InfMort1995-2000': [1996, 2000],
        'InfMort2000-2005': [2001, 2005],
        'InfMort2005-2010': [2006, 2010],
        'InfMort2010-2015': [2011, 2015],
    };

    $("#modal-about-trigger").on('click', function() { 
        $("#modal-about").modal('show');
    });

    $("#modal-methods-trigger").on('click', function() { 
        $("#modal-methods").modal('show');
    });

    $("#modal-data-trigger").on('click', function() { 
        $("#modal-data-sources").modal('show');
    });

    $("#modal-disclaimer-trigger").on('click', function() { 
        $("#modal-disclaimer").modal('show');
    });

    d3.queue()
        .defer(d3.csv, 'data/hepB-master.csv')
        .defer(d3.csv, 'data/seroprevalence_surveys.csv')
        .await(ready);

    function ready(e,hepData, surveyData) {
        makeCountryDropdown(hepData, surveyData);
    }


    function makeCountryDropdown(data, surveyData) {

        // we want to reverse the codes
        // should produce new output file instead
        var swappedIso = {};

        // select empty menus
        var $menuAfro = $('#menu-afro'),
            $menuEmro = $('#menu-emro'),
            $menuEuro = $('#menu-euro'),
            $menuPaho = $('#menu-paho'),
            $menuSearo = $('#menu-searo'),
            $menuWpro = $('#menu-wpro');

        var item;
        
        // loop through data
        data.forEach(function(datum) {

            // shortcut for code
            var dataISO = datum.ISO3;

            // shortcut for region
            var region = datum.Region;

            // loop through codes and create swapped object
            for(var code in isoCodes) {
                var codeISO = isoCodes[code];
                
                if(dataISO === codeISO) {
                    swappedIso[dataISO] = code
                }
            }

            // create item
            item = '<a class="item" href="#" data-value="' + dataISO + '"><i class="' + swappedIso[dataISO].toLowerCase() + ' flag"></i>' + datum.Country + '</a>';

            switch (region) {
                case "AFRO":
                    $menuAfro.append(item);
                    break;
                case "EMRO":
                    $menuEmro.append(item);
                    break;
                case "EURO":
                    $menuEuro.append(item);
                    break;
                case "PAHO":
                    $menuPaho.append(item);
                    break;
                case "SEARO":
                    $menuSearo.append(item);
                    break;
                case "WPRO":
                    $menuWpro.append(item);
                    break;
            }

        });

        makeCharts(data, surveyData);

    }

    function makeCharts(data, surveyData) {

        var ctxC = document.getElementById('vizC').getContext('2d');
        
        var chartC = new Chart(ctxC, {
            type: 'line',
            data: {
                datasets: [{
                    label: "% infants vaccinated with 3 doses of Hep B",
                    borderColor: '#f3e79b',
                    fill: false
                }, 
                {
                    label: "% infants vaccinated with 3 doses of Hep B birth",
                    borderColor: '#5c53a5',
                    fill: false
                }]
            },
            options: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true
                    },
                    onClick: null
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        var ctxD1 = document.getElementById('vizD-1').getContext('2d');

        var chartD1Data = {
            labels: ["Pre-vac", "2015 est", "Pre-vac", "2015 est"],
            datasets: [{
                type: "line",
                borderColor: "#0072bb",
                fill: false,
                pointRadius: 1
            },{
                type: "line",
                borderColor: "#0072bb",
                fill: false,
                pointRadius: 1
            },
            {
                type: "line",
                fill: false,
                showLine: false,
                pointRadius: 0,
                pointBackgroundColor: "orange"
            },
            {
                type: "line",
                fill: false,
                showLine: false,
                pointRadius: 0,
                pointBackgroundColor: "red"
            },{
                type: "bar",
                backgroundColor: '#0072bb'
            }]
        };
    

        var chartD1 = new Chart(ctxD1, {
            type: 'bar',
            data: chartD1Data,
            options: {
                title: {
                    display: false,
                },
                legend: false,
                tooltips: {
                    enabled: true,
                    mode: "index",
                    position: "nearest",
                    // custom: customTooltip
                }
            }
        });

        var ctxD1B = document.getElementById('vizD-1b').getContext('2d');

        var chartD1BData = {
            labels: ["Pre-vac", "2015 est", "Pre-vac", "2015 est"],
            datasets: [
            {
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "orange"
            },
            {
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "red"
            },{
                type: "bar",
                backgroundColor: 'purple',
                label: "region"
            },
            {
                type: "bar",
                backgroundColor: 'green',
                label: "income"
            }]
        };
    

        var chartD1B = new Chart(ctxD1B, {
            type: 'bar',
            data: chartD1BData,
            options: {
                title: {
                    display: true,
                },
                legend: false,
                tooltips: {
                    enabled: true,
                    mode: "index",
                    position: "nearest",
                    // custom: customTooltip
                }
            }
        });

        var chartD2Data = {
            labels: ["Pre-vac", "2015 est", "Pre-vac", "2015 est"],
            datasets: [
            {
                type: "line",
                borderColor: "lightgray",
                fill: false,
                pointRadius: 1
            },{
                type: "line",
                borderColor: "lightgray",
                fill: false,
                pointRadius: 1
            },{
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "orange"
            },{
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "red"
            },{
                type: "bar",
                backgroundColor: "#0072bb"
            }]
        };

        var ctxD2 = document.getElementById('vizD-2').getContext('2d');

        var chartD2 = new Chart(ctxD2, {
            type: 'bar',
            data: chartD2Data,
            options: {
                scaleBeginAtZero: true,
                title: {
                    display: false
                },
                legend: false,
                tooltips: {
                    enabled: true,
                    mode: "index",
                    position: "nearest",
                    // custom: customTooltip
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function(value, index, values) {
                                return value.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                        }
                    }]
                }
            }
        });


        var ctxD2B = document.getElementById('vizD-2b').getContext('2d');

        var chartD2BData = {
            labels: ["Pre-vac", "2015 est", "Pre-vac", "2015 est"],
            datasets: [
            {
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "orange"
            },
            {
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "red"
            },{
                type: "bar",
                backgroundColor: 'purple',
                label: "region"
            },
            {
                type: "bar",
                backgroundColor: 'green',
                label: "income"
            }]
        };
    

        var chartD2B = new Chart(ctxD2B, {
            type: 'bar',
            data: chartD2BData,
            options: {
                title: {
                    display: true,
                },
                legend: false,
                tooltips: {
                    enabled: true,
                    mode: "index",
                    position: "nearest",
                    // custom: customTooltip
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function(value, index, values) {
                                return value.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                        }
                    }]
                }
            }
        });

        var chartD3Data = {
            labels: ["< 5 yrs", "General pop"],
            datasets: [{
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "orange"
            },{
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "red"
            },{
                type: "bar",
                backgroundColor: "#0072bb"
            }]
        };

        var ctxD3 = document.getElementById('vizD-3').getContext('2d');

        var chartD3 = new Chart(ctxD3, {
            type: 'bar',
            data: chartD3Data,
            options: {
                scaleBeginAtZero: true,
                title: {
                    display: false
                },
                legend: false,
                tooltips: {
                    enabled: true,
                    mode: "index",
                    position: "nearest",
                    // custom: customTooltip
                    // custom: function(tooltip, data) {
                    //     console.log(tooltip, this);
                    // }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function(value, index, values) {
                                return value.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                        }
                    }]
                }
            }
        });


        var chartD3BData = {
            labels: ["< 5 yrs", "General pop"],
            datasets: [{
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "orange"
            },{
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "red"
            },{
                type: "bar",
                backgroundColor: 'purple',
                label: "region"
            },
            {
                type: "bar",
                backgroundColor: 'green',
                label: "income"
            }]
        };

        var ctxD3B = document.getElementById('vizD-3b').getContext('2d');

        var chartD3B = new Chart(ctxD3B, {
            type: 'bar',
            data: chartD3BData,
            options: {
                scaleBeginAtZero: true,
                title: {
                    display: false
                },
                legend: false,
                tooltips: {
                    enabled: true,
                    mode: "index",
                    position: "nearest",
                    // custom: customTooltip
                    // custom: function(tooltip, data) {
                    //     console.log(tooltip, this);
                    // }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function(value, index, values) {
                                return value.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                        }
                    }]
                }
            }
        });


        var currentYear = 1990,
            currentCode = "DZA";

        updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD1B, chartD2, chartD2B, chartD3, chartD3B);

        $('#year-dropdown').dropdown({
            on: "hover",
            onChange: function(value, text, $selectedItem) {
                currentYear = value;
                updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD1B, chartD2, chartD2B, chartD3, chartD3B);
            }
        });

        $('#country-dropdown').dropdown({
            on: "hover",
            onChange: function(value, text, $selectedItem) {
                currentCode = value;
                updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD1B, chartD2, chartD2B, chartD3, chartD3B);
                $("#dropdown-current-country").html(text);
            }
        });



    }

    function updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD1B, chartD2, chartD2B, chartD3, chartD3B) {

        // CHART A selections

        var $totalPop = $("#chartA-total-pop"),
            $totalPopU5 = $("#chartA-total-pop-u5"),
            $births = $("#chartA-births"),
            $infantMortality = $("#chartA-infant-mortality"),
            $urbanPop = $("#chartA-urban-population");

        $("#total-pop-year").html("(" + currentYear + ")");

         // CHART B selections

         var $hepBIntroYear = $('#chartB-hepB-intro-year'),
             $hepBBirthYear = $('#chartB-hepB-birth-year'),
             $chartBSchedule = $('#chartB-schedule');

        // CHART C data

        var chartCData1 = [],
            chartCData2 = [],
            chartCLabels = [];


        // CHART D data

        var chartD1Data = [],
            chartD1LowerCI = [],
            chartD1HigherCI = [];

        var chartD1BDataRegion = [],
            chartD1BDataIncome = [],
            chartD1BLowerCI = [],
            chartD1BHigherCI = [];
        
        var chartD2Data = [],
            chartD2LowerCI = [],
            chartD2HigherCI = [];

        var chartD2BDataRegion = [],
            chartD2BDataIncome = [];

        var chartD3Data = [],
            chartD3LowerCI = [],
            chartD3HigherCI = [];

        var chartD3BDataRegion = [],
            chartD3BDataIncome = [];


        data.forEach(function(datum) {

            // acccess data for current country
            if(datum.ISO3 === currentCode) {

                // CHART A

                $totalPop.html((datum['pop'+currentYear] * 1000).toLocaleString());

                for(var i = 1990; i <= 2015; i += 5) {
                    
                    if(currentYear >= i) {
                        $totalPopU5.html((datum['U5'+i] * 1000).toLocaleString());
                        $urbanPop.html((datum['UrbPop'+i] * 1000).toLocaleString());
                        $("#under-five-pop-years").html("(" + i + " &ndash; " + (+i + 4) + ")");
                        $("#urban-pop-years").html("(" + i + " &ndash; " + (+i + 4) + ")");
                    }
                }

                if($totalPopU5 === '') {
                    $totalPopU5.html('N/A');
                }


                for(var interval in birthYearIntervals) {
                    if(+currentYear >= birthYearIntervals[interval][0] && 
                       +currentYear <= birthYearIntervals[interval][1]) {
                           $births.html((datum[interval] * 1000).toLocaleString());
                           $("#birth-years").html("(" + birthYearIntervals[interval][0] + " &ndash; " + birthYearIntervals[interval][1]+ ")");
                    }
                }

                if($births.html() === '') {
                    $births.html('N/A');
                }

                for(var interval in infantMortalityIntervals) {
                    if(+currentYear >= infantMortalityIntervals[interval][0] && 
                       +currentYear <= infantMortalityIntervals[interval][1]) {
                           $infantMortality.html((datum[interval] * 1000).toLocaleString());
                           $("#infant-mortality-years").html("(" + infantMortalityIntervals[interval][0] + " &ndash; " + infantMortalityIntervals[interval][1] + ")");
                    }
                }

                if($births.html() === '') {
                    $infantMortality.html('N/A');
                }

                // CHART B

                $hepBIntroYear.html(Math.round(datum.HepBintroduced));
                $hepBBirthYear.html(Math.round(datum.HepBintroducedBirth));

                if(datum.schedule) {
                    $chartBSchedule.html(datum.schedule);
                } else {
                    $chartBSchedule.html("N/A");
                }
                


                // CHART C
                for(var i = 1990; i <= 2015; i++) {
                    if(datum['Cov_HepB3_' + i]) {
                        chartCData1.push(datum['Cov_HepB3_' + i]);
                    } else {
                        chartCData1.push(null);
                    }

                    if(datum['Cov_HepB_BD_' + i]) {
                        chartCData2.push(datum['Cov_HepB_BD_' + i]);
                    } else {
                        chartCData2.push(null);
                    }
                    
                    chartCLabels.push(String(i));
                }

                // CHART D

                chartD1Data = [
                    datum['PreU5EstPre'], 
                    datum['PostU5EstPre'], 
                    datum['PreGPEstPre'],
                    datum['PostGPEstPre']
                ];

                chartD1LowerCI = [
                    datum['PreU5EstPreLowCI'], 
                    datum['PostU5EstPreLowCI'],
                    datum['PreGPEstPreLowCI'],
                    datum['PostGPEstPreLowCI']
                ];

                chartD1HigherCI = [
                    datum['PreU5EstPreHighCI'], 
                    datum['PostU5EstPreHighCI'],
                    datum['PreGPEstPreHighCI'],
                    datum['PostGPEstPreHighCI']
                ];

                chartD1BDataRegion = [
                    datum['PreU5EstPre-region'], 
                    datum['PostU5EstPre-region'], 
                    datum['PreGPEstPre-region'], 
                    datum['PostGPEstPre-region'], 
                ];

                chartD1BDataIncome = [
                    datum['PreU5EstPre-income'],
                    datum['PostU5EstPre-income'],
                    datum['PreGPEstPre-income'],
                    datum['PostGPEstPre-income']
                ]

                chartD1BLowerCI = [


                ];

                chartD1BHigherCI = [


                ];

                chartD2Data = [
                    datum['PreU5EstCar'] * 1000, 
                    datum['PostU5EstCar'] * 1000, 
                    datum['PreGPEstCar'] * 1000,
                    datum['PostGPEstCar'] * 1000
                ];


                chartD2LowerCI = [
                    datum['PreU5EstCarLowCI'] * 1000, 
                    datum['PostU5EstCarLowCI'] * 1000,
                    datum['PreGPEstCarLowCI'] * 1000,
                    datum['PostGPEstCarLowCI'] * 1000
                ];

                chartD2HigherCI = [
                    datum['PreU5EstCarHighCI'] * 1000, 
                    datum['PostU5EstCarHighCI'] * 1000,
                    datum['PreGPEstCarHighCI'] * 1000,
                    datum['PostGPEstCarHighCI'] * 1000
                ];


                chartD2BDataRegion = [
                    datum['PreU5EstCar-region'] * 1000, 
                    datum['PostU5EstCar-region'] * 1000, 
                    datum['PreGPEstCar-region'] * 1000, 
                    datum['PostGPEstCar-region'] * 1000, 
                ];

                chartD2BDataIncome = [
                    datum['PreU5EstCar-income'] * 1000,
                    datum['PostU5EstCar-income'] * 1000,
                    datum['PreGPEstCar-income'] * 1000,
                    datum['PostGPEstCar-income'] * 1000
                ]

                chartD3Data = [
                    datum['NumCarPrevU5'] * 1000, 
                    datum['NumCarPrevGP'] * 1000
                ];

                chartD3LowerCI = [
                    datum['NumCarPrevU5LowCI'] * 1000, 
                    datum['NumCarPrevGPLowCI'] * 1000,
                ];

                chartD3HigherCI = [
                    datum['NumCarPrevU5HighCI'] * 1000, 
                    datum['NumCarPrevGPHighCI'] * 1000,
                ];

                chartD3BDataRegion = [
                    datum['NumCarPrevU5-region'] * 1000, 
                    datum['NumCarPrevGP-region'] * 1000
                ];

                chartD3BDataIncome = [
                    datum['NumCarPrevU5-income'] * 1000, 
                    datum['NumCarPrevGP-income'] * 1000
                ];

            } // end if country code
        });  // end forEach

        
        // find out which dataset is starts earlier and truncate the labels to this year
        var index1 = 0,
            index2 = 0;

        chartCData1.forEach(function(num, i) {
            if(num === null) {
                index1 = i;
            }
        });

        chartCData2.forEach(function(num, i) {
            if(num === null) {
                index2 = i;
            }
        })

        if(index1 < index2) {
            var index = index1;
        } else {
            var index = index2;
        }

        var slicedLabels = chartCLabels.slice(index, chartCLabels.length);

        chartC.data.labels = slicedLabels;

        chartCData1 = chartCData1.slice(index, chartCData1.length);
        chartCData2 = chartCData2.slice(index, chartCData2.length);

        var newCDataSets = [chartCData1, chartCData2];

        chartC.data.datasets.forEach(function(dataset, i) {
            dataset.data = newCDataSets[i];
        });
        
        chartC.update();

        chartD1.data.datasets.forEach(function(dataset, i) {
            if(i === 0) {
               dataset.data = [chartD1Data[0], chartD1Data[1], null, null]; 
            } else if (i ===1) {
               dataset.data = [null, null, chartD1Data[2], chartD1Data[3]];  
            } else if (i ===2) {
                dataset.data = chartD1LowerCI;
            } else if (i ===3) {
                dataset.data = chartD1HigherCI;
            } else {
                dataset.data = chartD1Data;
            }
            
        });

        chartD1.update();

        chartD1B.data.datasets.forEach(function(dataset, i) {
            if(i === 2) {
                dataset.data = chartD1BDataRegion;
            } else if(i ===3) {
                dataset.data = chartD1BDataIncome;
            }
        });

        chartD1B.update();

        chartD2.data.datasets.forEach(function(dataset, i) {
            if(i === 0) {
               dataset.data = [chartD2Data[0], chartD2Data[1], null, null]; 
            } else if(i ===1) {
               dataset.data = [null, null, chartD2Data[2], chartD2Data[3]];  
            } else if(i ===2) {
                dataset.data = chartD2LowerCI;
            } else if(i === 3) {
                dataset.data = chartD2HigherCI;
            } else {
                 dataset.data = chartD2Data;
            }
            
        });

        chartD2.update();

        chartD2B.data.datasets.forEach(function(dataset, i) {
            if(i === 2) {
                dataset.data = chartD2BDataRegion;
            } else if(i ===3) {
                dataset.data = chartD2BDataIncome;
            }
        });

        chartD2B.update();

        chartD3.data.datasets.forEach(function(dataset, i) {
            if(i === 0) {
                dataset.data = chartD3LowerCI;
            } else if(i === 1) {
                dataset.data = chartD3HigherCI;
            } else {
                dataset.data = chartD3Data;
            }
        });

        chartD3.update();

        chartD3B.data.datasets.forEach(function(dataset, i) {
            // if(i === 0) {
            //     dataset.data = chartD3LowerCI;
            // } else if(i === 1) {
            //     dataset.data = chartD3HigherCI;
            // } else {
            //     dataset.data = chartD3Data;
            // }
            if(i === 2) {
                dataset.data = chartD3BDataRegion;
            } else if(i === 3) {
                dataset.data = chartD3BDataIncome;
            }
        });

        chartD3B.update();


        // CHART E

        var chartE = $('#chartEtableBody'),
            html;

        surveyData.forEach(function(survey) {

            if(survey.ISO3 === currentCode) {

                html =  "<tr>" + 
                    "<td><div>" + survey['Year start'] + " &ndash; " + survey['Year end'] + "</div></td>" +
                    "<td><div>" + survey.Country + "</div></td>" +
                    "<td><div>" + survey.Level + "</div></td>" +
                    "<td><div>" + survey['Agestart'] + " &ndash; " + survey['Ageend'] + "</div></td>" +
                    "<td><div>" + (+survey['Sample size']).toLocaleString() + "</div></td>" +
                    "<td><div>" + survey.pHBsAg+ "</div></td>" +
                    "<td><div>" + survey['Author, Date'] + "</div></td>" +
                    "<td><div><a href='" + survey.URL + "'>link</a></div></td>" +
                "</tr>"

                chartE.append(html)

            }

        });

    }

    function customTooltip(tooltip) {


        if(tooltip.dataPoints) {
            var targetBarIndex = tooltip.dataPoints[0].index;

        }
        console.log(targetBarIndex)
        console.log(this._data)

        // Tooltip Element
        var tooltipEl = document.getElementById('chartjs-tooltip');

        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = "<table></table>"
            this._chart.canvas.parentNode.appendChild(tooltipEl);
        }

        // Remove if no tooltip
        if (tooltip.opacity === 0) {
            tooltipEl.remove();
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltip.yAlign) {
            tooltipEl.classList.add(tooltip.yAlign);
        } else {
            tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
            return bodyItem.lines;
        }

        // Set Text
        if (tooltip.body) {
            var titleLines = tooltip.title || [];
            var bodyLines = tooltip.body.map(getBody);

            var innerHtml = '<thead>';

            titleLines.forEach(function(title) {
                innerHtml += '<tr><th>' + title + '</th></tr>';
            });
            innerHtml += '</thead><tbody>';

            //bodyLines.reverse();

            bodyLines.forEach(function(body, i) {
              

                // hacky solution to get items ordered right in tooltip
                // if(i === 0) {
                //     var colors = tooltip.labelColors[3];
                //     var style = 'background:' + colors.backgroundColor;
                //     var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                //     innerHtml += '<tr><td>' + span + 'Estimated #' + body + '</td></tr>';
                // } else if(i === 1) {
                //     var colors = tooltip.labelColors[2];
                //     var style = 'background:' + colors.backgroundColor;
                //     style += '; border-radius: 50%';
                //     var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                //     innerHtml += '<tr><td>' + span + 'Upper CI #' + body + '</td></tr>';
                // } else if(i === 2) {
                //     var colors = tooltip.labelColors[1];
                //     var style = 'background:' + colors.backgroundColor;
                //     style += '; border-radius: 50%';
                //     var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                //     innerHtml += '<tr><td>' + span + 'Lower CI #' + body + '</td></tr>';
                // }
          
            });
            innerHtml += '</tbody>';

            var tableRoot = tooltipEl.querySelector('table');
            tableRoot.innerHTML = innerHtml;
        }

        var positionY = this._chart.canvas.offsetTop;
        var positionX = this._chart.canvas.offsetLeft;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        tooltipEl.style.fontFamily = tooltip._fontFamily;
        tooltipEl.style.fontSize = tooltip.fontSize;
        tooltipEl.style.fontStyle = tooltip._fontStyle;
        tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
    };



})(Chart, $);
