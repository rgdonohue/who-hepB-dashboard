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
        .defer(d3.json, 'data/countries.json')
        .await(ready);

    function ready(e,hepData, surveyData, countries) {
        makeCountryDropdown(hepData, surveyData);
        makeMap(hepData, countries);
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
                    label: "% infants vaccinated with birth dose of Hep B",
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
                },
                tooltips: {
                    enabled: false
                }
            }
        });

        var ctxD1 = document.getElementById('vizD-1').getContext('2d');

        var chartD1Data = {
            labels: ["Pre-vaccination", "2015 estimate", "Pre-vaccination", "2015 estimate"],
            datasets: [{
                type: "line",
                borderColor: "lightgray",
                borderWidth: 2,
                fill: false,
                pointRadius: 1
            },{
                type: "line",
                borderColor: "lightgray",
                borderWidth: 2,
                fill: false,
                pointRadius: 1
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
                    enabled: false,
                    mode: "index",
                    position: "nearest"
                }
            }
        });

        var ctxD1B = document.getElementById('vizD-1b').getContext('2d');

        var chartD1BData = {
            labels: ["Pre-vaccination", "2015 estimate", "Pre-vaccination", "2015 estimate"],
            datasets: [{
                type: "bar",
                backgroundColor: 'purple',
                label: "region"
            }]
        };
    

        var chartD1B = new Chart(ctxD1B, {
            type: 'bar',
            data: chartD1BData,
            options: {
                title: {
                    display: true,
                },
                legend: {
                    display: false,
                    position: 'top',
                    fullWidth: false,
                    onClick: null
                },
                tooltips: {
                    enabled: false,
                    mode: "index",
                    position: "nearest"
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

        var ctxD1C = document.getElementById('vizD-1c').getContext('2d');

        var chartD1CData = {
            labels: ["Pre-vaccination", "2015 estimate", "Pre-vaccination", "2015 estimate"],
            datasets: [{
                type: "bar",
                backgroundColor: 'green',
                label: "income"
            }]
        };
    

        var chartD1C = new Chart(ctxD1C, {
            type: 'bar',
            data: chartD1CData,
            options: {
                title: {
                    display: true,
                },
                legend: {
                    display: false,
                    position: 'top',
                    fullWidth: false,
                    onClick: null
                },
                tooltips: {
                    enabled: false,
                    mode: "index",
                    position: "nearest"
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

        var chartD2Data = {
            labels: ["Pre-vaccination", "2015 estimate", "Pre-vaccination", "2015 estimate"],
            datasets: [
            {
                type: "line",
                borderColor: "lightgray",
                borderWidth: 2,
                fill: false,
                pointRadius: 1
            },{
                type: "line",
                borderColor: "lightgray",
                borderWidth: 2,
                fill: false,
                pointRadius: 1
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
                    enabled: false,
                    mode: "index",
                    position: "nearest"
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
                type: "bar",
                backgroundColor: 'purple',
                label: "region"
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
                    enabled: false,
                    mode: "index",
                    position: "nearest"
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

        var ctxD2C = document.getElementById('vizD-2c').getContext('2d');

        var chartD2CData = {
            labels: ["Pre-vac", "2015 est", "Pre-vac", "2015 est"],
            datasets: [
            {
                type: "bar",
                backgroundColor: 'green',
                label: "income"
            }]
        };
    

        var chartD2C = new Chart(ctxD2C, {
            type: 'bar',
            data: chartD2CData,
            options: {
                title: {
                    display: true,
                },
                legend: false,
                tooltips: {
                    enabled: false,
                    mode: "index",
                    position: "nearest"
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
            labels: ["under 5 years old", "general population"],
            datasets: [{
                type: "bar",
                backgroundColor: "#0072bb"
            }]
        };

        var ctxD3 = document.getElementById('vizD-3').getContext('2d');

        var chartD3 = new Chart(ctxD3, {
            type: 'bar',
            data: chartD3Data,
            options: {
                // scaleBeginAtZero: true,
                title: {
                    display: false
                },
                legend: false,
                tooltips: {
                    enabled: false,
                    mode: "index",
                    position: "nearest"
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
                type: "bar",
                backgroundColor: 'purple',
                label: "region"
            }]
        };

        var ctxD3B = document.getElementById('vizD-3b').getContext('2d');

        var chartD3B = new Chart(ctxD3B, {
            type: 'bar',
            data: chartD3BData,
            options: {
                title: {
                    display: false
                },
                legend: false,
                tooltips: {
                    enabled: false,
                    mode: "index",
                    position: "nearest"
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

        var chartD3CData = {
            labels: ["< 5 yrs", "General pop"],
            datasets: [{
                type: "bar",
                backgroundColor: 'green',
                label: "income"
            }]
        };

        var ctxD3C = document.getElementById('vizD-3c').getContext('2d');

        var chartD3C = new Chart(ctxD3C, {
            type: 'bar',
            data: chartD3CData,
            options: {
                scaleBeginAtZero: true,
                title: {
                    display: false
                },
                legend: false,
                tooltips: {
                    enabled: false,
                    mode: "index",
                    position: "nearest"
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

        updateChartA(data, currentYear, currentCode);
        updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD1B, chartD1C, chartD2, chartD2B, chartD2C, chartD3, chartD3B, chartD3C);

        $('#year-dropdown').dropdown({
            on: "hover",
            onChange: function(value, text, $selectedItem) {
                currentYear = value;
                updateChartA(data, currentYear, currentCode);
            }
        });

        $(".current-country").html('<i class="dz flag"></i> Algeria')

        $('#country-dropdown').dropdown({
            on: "hover",
            onChange: function(value, text, $selectedItem) {
                currentCode = value;
                updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD1B, chartD1C, chartD2, chartD2B, chartD2C, chartD3, chartD3B, chartD3C);
                $("#dropdown-current-country").html(text);
                $(".current-country").html(text);
            }
        });



    }

    function updateChartA(data, currentYear, currentCode) {

        // CHART A selections

        var $totalPop = $("#chartA-total-pop"),
            $totalPopU5 = $("#chartA-total-pop-u5"),
            $births = $("#chartA-births"),
            $infantMortality = $("#chartA-infant-mortality"),
            $urbanPop = $("#chartA-urban-population");

        $("#total-pop-year").html("(" + currentYear + ")");

        data.forEach(function(datum) {

            // acccess data for current country
            if(datum.ISO3 === currentCode) {

                // CHART A

                $totalPop.html((datum['pop'+currentYear] * 1000).toLocaleString());

                for(var i = 1990; i <= 2015; i += 5) {
                    
                    if(currentYear >= i) {
                        $totalPopU5.html((datum['U5'+i] * 1000).toLocaleString());
                        $urbanPop.html(Math.round(datum['UrbPop'+i] * 10)/10 + "%");
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
                           $infantMortality.html(Math.round(datum[interval] * 10)/10 + " per 1,000");
                           $("#infant-mortality-years").html("(" + infantMortalityIntervals[interval][0] + " &ndash; " + infantMortalityIntervals[interval][1] + ")");
                    }
                }

                if($births.html() === '') {
                    $infantMortality.html('N/A');
                }
            }
        });
    }

    function updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD1B, chartD1C, chartD2, chartD2B, chartD2C, chartD3, chartD3B, chartD3C) {

         // CHART B selections

         var $hepBIntroYear = $('#chartB-hepB-intro-year'),
             $hepBBirthYear = $('#chartB-hepB-birth-year'),
             $chartBSchedule = $('#chartB-schedule'),
             $chartBType = $('#chartB-type');

        // CHART C data

        var chartCData1 = [],
            chartCData2 = [],
            chartCLabels = [];


        // CHART D data

        var chartD1Data = [],
            chartD1LowerCI = [],
            chartD1UpperCI = [];

        var chartD1BData = [],
            chartD1BLowerCI = [],
            chartD1BUpperCI = [];
        
        var chartD1CData = [],
            chartD1CLowerCI = [],
            chartD1CUpperCI = [];
        
        var chartD2Data = [],
            chartD2LowerCI = [],
            chartD2UpperCI = [];

        var chartD2BData = [],
            chartD2BLowerCI = [],
            chartD2BUpperCI = [];

        var chartD2CData = [],
            chartD2CLowerCI = [],
            chartD2CUpperCI = [];

        var chartD3Data = [],
            chartD3LowerCI = [],
            chartD3UpperCI = [];

        var chartD3BData = [],
            chartD3BLowerCI = [],
            chartD3BUpperCI = [];

        var chartD3CData = [],
            chartD3CLowerCI = [],
            chartD3CUpperCI = [];


        data.forEach(function(datum) {

            // acccess data for current country
            if(datum.ISO3 === currentCode) {

                // CHART B

                $hepBIntroYear.html(Math.round(datum.HepBintroduced));
                $hepBBirthYear.html(Math.round(datum.HepBintroducedBirth));

                if(datum.schedule) {
                    $chartBSchedule.html(datum.schedule);
                } else {
                    $chartBSchedule.html("N/A");
                }

                $chartBType.html(datum.Type);
                


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

                chartD1UpperCI = [
                    datum['PreU5EstPreHighCI'], 
                    datum['PostU5EstPreHighCI'],
                    datum['PreGPEstPreHighCI'],
                    datum['PostGPEstPreHighCI']
                ];

                chartD1BData = [
                    datum['PreU5EstPre-region'], 
                    datum['PostU5EstPre-region'], 
                    datum['PreGPEstPre-region'], 
                    datum['PostGPEstPre-region'], 
                ];

                chartD1CData = [
                    datum['PreU5EstPre-income'],
                    datum['PostU5EstPre-income'],
                    datum['PreGPEstPre-income'],
                    datum['PostGPEstPre-income']
                ]

                chartD1BLowerCI = [
                    datum['PreU5EstPreLowCI-region'], 
                    datum['PostU5EstPreLowCI-region'], 
                    datum['PreGPEstPreLowCI-region'], 
                    datum['PostGPEstPreLowCI-region']
                ];

                chartD1BUpperCI = [
                    datum['PreU5EstPreHighCI-region'], 
                    datum['PostU5EstPreHighCI-region'], 
                    datum['PreGPEstPreHighCI-region'], 
                    datum['PostGPEstPreHighCI-region']
                ];

                chartD1CLowerCI = [
                    datum['PreU5EstPreLowCI-income'], 
                    datum['PostU5EstPreLowCI-income'], 
                    datum['PreGPEstPreLowCI-income'], 
                    datum['PostGPEstPreLowCI-income']
                ];

                chartD1CUpperCI = [
                    datum['PreU5EstPreHighCI-income'], 
                    datum['PostU5EstPreHighCI-income'], 
                    datum['PreGPEstPreHighCI-income'], 
                    datum['PostGPEstPreHighCI-income']
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

                chartD2UpperCI = [
                    datum['PreU5EstCarHighCI'] * 1000, 
                    datum['PostU5EstCarHighCI'] * 1000,
                    datum['PreGPEstCarHighCI'] * 1000,
                    datum['PostGPEstCarHighCI'] * 1000
                ];

                chartD2BData = [
                    datum['PreU5EstCar-region'] * 1000, 
                    datum['PostU5EstCar-region'] * 1000, 
                    datum['PreGPEstCar-region'] * 1000, 
                    datum['PostGPEstCar-region'] * 1000, 
                ];

                chartD2CData = [
                    datum['PreU5EstCar-income'] * 1000,
                    datum['PostU5EstCar-income'] * 1000,
                    datum['PreGPEstCar-income'] * 1000,
                    datum['PostGPEstCar-income'] * 1000
                ];

                chartD2BLowerCI = [
                    datum['PreU5EstCarLowCI-region'] * 1000, 
                    datum['PostU5EstCarLowCI-region'] * 1000, 
                    datum['PreGPEstCarLowCI-region'] * 1000, 
                    datum['PostGPEstCarLowCI-region'] * 1000, 
                ];

                chartD2BUpperCI = [
                    datum['PreU5EstCarHighCI-region'] * 1000, 
                    datum['PostU5EstCarHighCI-region'] * 1000, 
                    datum['PreGPEstCarHighCI-region'] * 1000, 
                    datum['PostGPEstCarHighCI-region'] * 1000, 
                ];

                chartD2CLowerCI = [
                    datum['PreU5EstCarLowCI-income'] * 1000,
                    datum['PostU5EstCarLowCI-income'] * 1000,
                    datum['PreGPEstCarLowCI-income'] * 1000,
                    datum['PostGPEstCarLowCI-income'] * 1000
                ];

                chartD2CUpperCI = [
                    datum['PreU5EstCarHighCI-income'] * 1000,
                    datum['PostU5EstCarHighCI-income'] * 1000,
                    datum['PreGPEstCarHighCI-income'] * 1000,
                    datum['PostGPEstCarHighCI-income'] * 1000
                ];

                chartD3Data = [
                    datum['NumCarPrevU5'] * 1000, 
                    datum['NumCarPrevGP'] * 1000
                ];

                chartD3LowerCI = [
                    datum['NumCarPrevU5LowCI'] * 1000, 
                    datum['NumCarPrevGPLowCI'] * 1000,
                ];

                chartD3UpperCI = [
                    datum['NumCarPrevU5HighCI'] * 1000, 
                    datum['NumCarPrevGPHighCI'] * 1000,
                ];

                chartD3BData = [
                    datum['NumCarPrevU5-region'] * 1000, 
                    datum['NumCarPrevGP-region'] * 1000
                ];

                chartD3BLowerCI = [
                    datum['NumCarPrevU5LowCI-region'] * 1000, 
                    datum['NumCarPrevGPLowCI-region'] * 1000
                ];

                chartD3BUpperCI = [
                    datum['NumCarPrevU5HighCI-region'] * 1000, 
                    datum['NumCarPrevGPHighCI-region'] * 1000
                ];

                chartD3CData = [
                    datum['NumCarPrevU5-income'] * 1000, 
                    datum['NumCarPrevGP-income'] * 1000
                ];

                chartD3CLowerCI = [
                    datum['NumCarPrevU5LowCI-income'] * 1000, 
                    datum['NumCarPrevGPLowCI-income'] * 1000
                ];

                chartD3CUpperCI = [
                    datum['NumCarPrevU5HighCI-income'] * 1000, 
                    datum['NumCarPrevGPHighCI-income'] * 1000
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
            } else if (i === 1) {
               dataset.data = [null, null, chartD1Data[2], chartD1Data[3]];  
            } else {
                dataset.data = chartD1Data;
            }
            
        });

        chartD1.options.tooltips.custom = function(tooltip) {

            if(tooltip.dataPoints) {
                console.log(this)
                var barIndex = tooltip.dataPoints[0].index;
                createTooltip(this, tooltip, barIndex, chartD1Data, chartD1UpperCI, chartD1LowerCI, "Estimated %");
            } else {
                document.getElementById('chartjs-tooltip').remove();
            }
        }


        chartD1.update();

        chartD1B.data.datasets.forEach(function(dataset, i) {
            dataset.data = chartD1BData;
        });


        chartD1B.options.tooltips.custom = function(tooltip) {

            if(tooltip.dataPoints) {
                var barIndex = tooltip.dataPoints[0].index;
                createTooltip(this, tooltip, barIndex, chartD1BData, chartD1BUpperCI, chartD1BLowerCI, "Estimated %");
            } else {
                document.getElementById('chartjs-tooltip').remove();
            }
        }

        chartD1B.update();

        chartD1C.data.datasets.forEach(function(dataset, i) {
            dataset.data = chartD1BData;
        });

        chartD1C.options.tooltips.custom = function(tooltip) {

            if(tooltip.dataPoints) {
                var barIndex = tooltip.dataPoints[0].index;
                createTooltip(this, tooltip, barIndex, chartD1CData, chartD1CUpperCI, chartD1CLowerCI, "Estimated %");
            } else {
                document.getElementById('chartjs-tooltip').remove();
            }
        }

        chartD1C.update();

        chartD2.data.datasets.forEach(function(dataset, i) {
            if(i === 0) {
               dataset.data = [chartD2Data[0], chartD2Data[1], null, null]; 
            } else if(i ===1) {
               dataset.data = [null, null, chartD2Data[2], chartD2Data[3]];  
            } else {
                 dataset.data = chartD2Data;
            }
            
        });

        chartD2.options.tooltips.custom = function(tooltip) {

            if(tooltip.dataPoints) {
                var barIndex = tooltip.dataPoints[0].index;
                createTooltip(this, tooltip, barIndex, chartD2Data, chartD2UpperCI, chartD2LowerCI, "Estimated #");
            } else {
                document.getElementById('chartjs-tooltip').remove();
            }  
        }

        chartD2.update();

        chartD2B.data.datasets.forEach(function(dataset, i) {
            dataset.data = chartD2BData;
        });

        chartD2B.options.tooltips.custom = function(tooltip) {

            if(tooltip.dataPoints) {
                var barIndex = tooltip.dataPoints[0].index;
                createTooltip(this, tooltip, barIndex, chartD2BData, chartD2BUpperCI, chartD2BLowerCI, "Estimated #");
            } else {
                document.getElementById('chartjs-tooltip').remove();
            }
        }

        chartD2B.update();

        chartD2C.data.datasets.forEach(function(dataset, i) {
            dataset.data = chartD2CData;
        });

        chartD2C.options.tooltips.custom = function(tooltip) {

            if(tooltip.dataPoints) {
                var barIndex = tooltip.dataPoints[0].index;
                createTooltip(this, tooltip, barIndex, chartD2CData, chartD2CUpperCI, chartD2CLowerCI,"Estimated #");
            } else {
                document.getElementById('chartjs-tooltip').remove();
            }
        }

        chartD2C.update();

        chartD3.data.datasets.forEach(function(dataset, i) {
            dataset.data = chartD3Data;
        });

        chartD3.options.tooltips.custom = function(tooltip) {

            if(tooltip.dataPoints) {
                var barIndex = tooltip.dataPoints[0].index;
                createTooltip(this, tooltip, barIndex, chartD3Data, chartD3UpperCI, chartD3LowerCI, "# prevented: ");
            } else {
                document.getElementById('chartjs-tooltip').remove();
            }  
        }

        chartD3.update();

        chartD3B.data.datasets.forEach(function(dataset, i) {
            dataset.data = chartD3BData;
        });

        chartD3B.options.tooltips.custom = function(tooltip) {

            if(tooltip.dataPoints) {
                var barIndex = tooltip.dataPoints[0].index;
                createTooltip(this, tooltip, barIndex, chartD3BData, chartD3BUpperCI, chartD3BLowerCI, "# prevented: ");
            } else {
                document.getElementById('chartjs-tooltip').remove();
            }  
        }

        chartD3B.update();

        chartD3C.data.datasets.forEach(function(dataset, i) {
            dataset.data = chartD3CData;
        });

        chartD3C.options.tooltips.custom = function(tooltip) {

            if(tooltip.dataPoints) {
                var barIndex = tooltip.dataPoints[0].index;
                createTooltip(this, tooltip, barIndex, chartD3CData, chartD3CUpperCI, chartD3CLowerCI, "# prevented: ");
            } else {
                document.getElementById('chartjs-tooltip').remove();
            }  
        }

        chartD3C.update();


        // CHART E

        var $chartEBody = $('#chartETable tbody').html(''),
            html;

        surveyData.forEach(function(survey) {

            if(survey.ISO3 === currentCode) {

                html =  "<tr>" + 
                    "<td><div>" + survey['Year start'] + " &ndash; " + survey['Year end'] + "</div></td>" +
                    "<td><div>" + survey.Level + "</div></td>" +
                    "<td><div>" + survey['Agestart'] + " &ndash; " + survey['Ageend'] + "</div></td>" +
                    "<td><div>" + (+survey['Sample size']).toLocaleString() + "</div></td>" +
                    "<td><div>" + survey.pHBsAg+ "</div></td>" +
                    "<td><div>" + survey['Author, Date'] + "</div></td>" +
                    "<td><div><a href='" + survey.URL + "'>link</a></div></td>" +
                "</tr>"

                $chartEBody.append(html)

            }

        });

        $("#chartETable").DataTable({
            "scrollY": "200px",
            "scrollCollapse": true,
            "paging": false,
            "searching": false
        });

    }

    function createTooltip(cntx, tooltip, index, d, dhighci, dlowci, valueLabel) {

        var title = tooltip.title,
            value = d[index].toLocaleString(),
            hiCi = dhighci[index].toLocaleString(),
            lowCi = dlowci[index].toLocaleString();

          // Tooltip Element
        var tooltipEl = document.getElementById('chartjs-tooltip');

        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = "<table class='ui celled table'></table>"
            cntx._chart.canvas.parentNode.appendChild(tooltipEl);
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltip.yAlign) {
            tooltipEl.classList.add(tooltip.yAlign);
        } else {
            tooltipEl.classList.add('no-transform');
        }

        var innerHtml = '<thead>';

    
        innerHtml += '<tr><th>' + title + '</th></tr>';
 
        innerHtml += '</thead><tbody>';

        innerHtml += '<tr><td>' + valueLabel + ': ' + value + '</td></tr>';

        innerHtml += '<tr><td>' + 'Upper CI: ' + hiCi + '</td></tr>';

        innerHtml += '<tr><td>' + 'Lower CI: ' + lowCi + '</td></tr>';

        innerHtml += '</tbody>';

        var tableRoot = tooltipEl.querySelector('table');
        
        tableRoot.innerHTML = innerHtml;

        var positionY = cntx._chart.canvas.offsetTop;
        var positionX = cntx._chart.canvas.offsetLeft;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        tooltipEl.style.fontFamily = tooltip._fontFamily;
        tooltipEl.style.fontSize = tooltip.fontSize;
        tooltipEl.style.fontStyle = tooltip._fontStyle;
        tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';

    }


    function makeMap(data, countries) {

        var colors = [ 
            "#ffc6c4",
            "#ee919b",
            "#cc607d",
            "#9e3963"
        ];

        $("#legend1").css('background', colors[3]);
        $("#legend2").css('background', colors[2]);
        $("#legend3").css('background', colors[1]);
        $("#legend4").css('background', colors[0]);
        $("#legend5").css('background', "#979797");

        data.forEach(function(datum) {
            var dataIso = datum.ISO3;

            countries.objects.countries.geometries.forEach(function(country) {

                var iso = country.properties.iso;
                if(dataIso === iso) {
                    country.properties.data = datum;
                }
            });
        });

        var width = d3.select("#map").style("width").slice(0, -2),
            height = d3.select("#map").style("height").slice(0, -2);

        var svg = d3.select("#map svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "map-svg")

        var geoJSON = topojson.feature(countries, {
            type: "GeometryCollection",
            geometries: countries.objects.countries.geometries
        });
        
        var projection = d3.geoEckert3()
            // .scale(Math.PI * 2)
            .fitSize([width, height], geoJSON)
            // .translate([0, 0])
            // .precision(0.1);

        var path = d3.geoPath()
            .projection(projection);

        var graticule = d3.geoGraticule();

        var path = d3.geoPath()
            .projection(projection);

        var zoom = d3.zoom()
            .scaleExtent([10, 200])
            .on("zoom", zoomed);

        var center = projection([-30, 20]);

        var grat = svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path);

        var countrySvgs = svg.selectAll("path")
            .data(topojson.feature(countries, countries.objects.countries).features
                    .filter(function(d) {
                        if(d.properties.iso != "ATA") {
                            return d;
                        }
                    }))
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", path)
            .on('mouseover', function(d) {
                // console.log(d.properties.data);
            })

        // svg.call(zoom)
        //     .call(zoom.transform, d3.zoomIdentity
        //         .translate(width / 2, height / 2)
        //         .scale(19.5)
        //         .translate(-center[0] - 3, -center[1] - 1));

        function zoomed() {

            var transform = d3.event.transform;

            countries.attr("transform", transform)
                .style("stroke-width", 1 / transform.k);

            grat.attr("transform", transform)
                .style("stroke-width", 1 / transform.k);

            //                d3.select('defs path').attr("transform", transform);
        }

        updateMap(countrySvgs, data, "PreU5EstPre");

        $(".checkbox").checkbox({
            onChecked: function(t) {
                var val = $(this).attr('data-value');
                updateMap(countrySvgs, data, val);
            }
        });

        d3.select("#map")
            .on("resize", sizeChange);
            
        function sizeChange() {
            d3.select("#map-svg").attr("transform", "scale(" + $("#container").width()/900 + ")");
	        $("#map-svg").height($("#map").width()*0.618);
        }

    }

    function updateMap(countries, data, variable) {

        var colors = [ 
            "#ffc6c4",
            "#ee919b",
            "#cc607d",
            "#9e3963"
        ];

        var breaks = [2, 5, 8]

        var color = d3.scaleThreshold()
            .domain(breaks)
            .range(colors);

        countries.attr('fill', function(d) {
            try {
                return color(d.properties.data[variable]);
            } catch(e) {
                return "#979797";
            }
        });

    }



})(Chart, $);
