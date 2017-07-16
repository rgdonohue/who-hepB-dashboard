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

    d3.csv('data/hepB-master.csv', function(e,d){
        makeCountryDropdown(d);
    });

    function makeCountryDropdown(data) {

        // we want to reverse the codes
        // should produce new output file instead
        var swappedIso = {};

        // select empty menu
        var $menu = $('#countryMenu');
        
        // loop through data
        data.forEach(function(datum) {

            // shortcut for code
            var dataISO = datum.ISO3;

            // loop through codes and create swapped object
            for(var code in isoCodes) {
                var codeISO = isoCodes[code];
                
                if(dataISO === codeISO) {
                    swappedIso[dataISO] = code
                }
            }

            // create item
            var item = '<div class="item" data-value="' + dataISO + '"><i class="' + swappedIso[dataISO].toLowerCase() + ' flag"></i>' + datum.Country + '</div>';

            // append to menu
            $menu.append(item);

        });

        $menu.change();

        makeCharts(data);

    }

    function makeCharts(data) {

        var ctxC = document.getElementById('vizC').getContext('2d');
        
        var chartC = new Chart(ctxC, {
            // The type of chart we want to create
            type: 'line',

            // The data dataset
            data: {
                labels: ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", 
                         "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006",
                         "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2015", "2014", "2015"],
                datasets: [{
                    label: "Percentage of infants vaccinated with 3 doses of Hep B (2015)",
                    borderColor: 'rgb(255, 99, 132)',
                    data: [1,2],
                }, 
                {
                    label: "Percentage of infants vaccinated with 3 doses of Hep B birth (2015)",
                    borderColor: 'rgb(0, 99, 132)',
                    data: [2,3],
                }]
            },
            options: {}
        });

        var ctxD1 = document.getElementById('vizD-1').getContext('2d');

        var chartD1Data = {
            labels: ["Pre-vac", "2015 est", "Pre-vac", "2015 est"],
            datasets: [{
                type: "line",
                borderColor: "lightgray",
                fill: false,
                pointRadius: 1,
                data: []
            },{
                type: "line",
                borderColor: "lightgray",
                fill: false,
                pointRadius: 1,
                data: []
            },
            {
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "orange",
                data: []
            },
            {
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "red",
                data: []
            },{
                type: "bar",
                backgroundColor: "steelblue",
                data: []
            }]
        };
    

        var chartD1 = new Chart(ctxD1, {
            type: 'bar',
            data: chartD1Data,
            options: {
                scaleBeginAtZero: true,
                title: {
                    display: true,
                    text: "estimated prevalence %",
                    position: 'left',
                    fontFamily: "Lato",
                    fontStyle: "normal",
                    fontSize: 14
                },
                legend: false,
                tooltips: {
                    enabled: false,
                    mode: "index",
                    position: "nearest",
                    custom: customTooltips
                }
            }
        });

        var chart2Data = {
            labels: ["Pre-vac", "2015 est", "Pre-vac", "2015 est"],
            datasets: [{
                type: "line",
                borderColor: "lightgray",
                fill: false,
                pointRadius: 1,
                data: []
            },{
                type: "line",
                borderColor: "lightgray",
                fill: false,
                pointRadius: 1,
                data: []
            },
            {
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "orange",
                data: []
            },
            {
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "red",
                data: []
            },{
                type: "bar",
                backgroundColor: "steelblue",
                data: []
            }]
        };

        var ctxD2 = document.getElementById('vizD-2').getContext('2d');

        var chartD2 = new Chart(ctxD2, {
            type: 'bar',
            data: chart2Data,
            options: {
                scaleBeginAtZero: true,
                title: {
                    display: true,
                    text: "estimated # of carriers",
                    position: 'left',
                    fontFamily: "Lato",
                    fontStyle: "normal",
                    fontSize: 14
                },
                legend: false,
                tooltips: {
                    enabled: false,
                    mode: "index",
                    position: "nearest",
                    custom: customTooltips
                }
            }
        });

        var chartD3Data = {
            labels: ["Pre-vac", "2015 est"],
            datasets: [{
                type: "line",
                borderColor: "lightgray",
                fill: false,
                data: []
            },{
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "orange",
                data: []
            },
            {
                type: "line",
                fill: false,
                showLine: false,
                pointBackgroundColor: "red",
                data: []
            },{
                type: "bar",
                backgroundColor: "steelblue",
                data: []
            }]
        };

        var ctxD3 = document.getElementById('vizD-3').getContext('2d');

        var chartD3 = new Chart(ctxD3, {
            type: 'bar',
            data: chartD3Data,
            options: {
                scaleBeginAtZero: true,
                title: {
                    display: true,
                    text: "# of carriers prevented",
                    position: 'left',
                    fontFamily: "Lato",
                    fontStyle: "normal",
                    fontSize: 14
                },
                legend: false,
                tooltips: {
                    enabled: false,
                    mode: "index",
                    position: "nearest",
                    custom: customTooltips
                }
            }
        });

        var currentYear = 1990,
            currentCode = "DZA";

        updateCharts(data, 1990, currentCode, chartC, chartD1, chartD2, chartD3);

        $('#year-dropdown').dropdown({
            on: "hover",
            onChange: function(value, text, $selectedItem) {
                currentYear = value;
                updateCharts(data, currentYear, currentCode, chartC, chartD1, chartD2, chartD3);
            }
        });

        $('#country-dropdown').dropdown({
            on: "hover",
            onChange: function(value, text, $selectedItem) {
                currentCode = value;
                updateCharts(data, currentYear, currentCode, chartC, chartD1, chartD2, chartD3);
            }
        });

    }

    function updateCharts(data, currentYear, currentCode, chartC, chartD1, chartD2, chartD3) {

        // CHART A selections

        var $totalPop = $("#chartA-total-pop"),
            $totalPopU5 = $("#chartA-total-pop-u5"),
            $births = $("#chartA-births"),
            $infantMortality = $("#chartA-infant-mortality");

         // CHART B selections

         var $hepBIntroYear = $('#chartB-hepB-intro-year'),
             $hepBBirthYear = $('#chartB-hepB-birth-year'),
             $chartBSchedule = $('#chartB-schedule');

        // CHART C data

        var chartCData1 = [],
            chartCData2 = [];

        // CHART D data

        var chartD1Data = [],
            chartD2Data = [],
            chartD3Data = [];

        var chartD1LowerCI = [],
            chartD1HigherCI = [],
            chartD2LowerCI = [],
            chartD2HigherCI = [],
            chartD3LowerCI = [],
            chartD3HigherCI = [];


        data.forEach(function(datum) {

            // acccess data for current country
            if(datum.ISO3 === currentCode) {

                // CHART A

                $totalPop.html((datum['pop'+currentYear] * 1000).toLocaleString());

                for(var i = 1990; i <= 2015; i += 5) {
                    if(currentYear <= i) {
                        $totalPopU5.html((datum['U5'+i] * 1000).toLocaleString());
                    }
                }

                if($totalPopU5 === '') {
                    $totalPopU5.html('N/A');
                }


                for(var interval in birthYearIntervals) {
                    if(+currentYear >= birthYearIntervals[interval][0] && 
                       +currentYear <= birthYearIntervals[interval][1]) {
                           $births.html(datum[interval] * 1000);
                    }
                }

                if($births.html() === '') {
                    $births.html('N/A');
                }

                for(var interval in infantMortalityIntervals) {
                    if(+currentYear >= infantMortalityIntervals[interval][0] && 
                       +currentYear <= infantMortalityIntervals[interval][1]) {
                           $infantMortality.html((datum[interval] * 1000).toLocaleString());
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
                        chartCData1.push('null');
                    }
                    
                    if(datum['Cov_HepB_BD_' + i]) {
                        chartCData2.push(datum['Cov_HepB_BD_' + i]);
                    } else {
                        chartCData2.push('null');
                    }  
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

                chartD2Data = [
                    datum['PreU5EstCar'], 
                    datum['PostU5EstCar'], 
                    datum['PreGPEstCar'],
                    datum['PostGPEstCar']
                ];

                chartD2LowerCI = [
                    datum['PreU5EstCarLowCI'], 
                    datum['PostU5EstCarLowCI'],
                    datum['PreGPEstCarLowCI'],
                    datum['PostGPEstCarLowCI']
                ];

                chartD2HigherCI = [
                    datum['PreU5EstCarHighCI'], 
                    datum['PostU5EstCarHighCI'],
                    datum['PreGPEstCarHighCI'],
                    datum['PostGPEstCarHighCI']
                ];

                chartD3Data = [
                    datum['NumCarPrevU5'], 
                    datum['NumCarPrevGP']
                ];

                chartD3LowerCI = [
                    datum['NumCarPrevU5LowCI'], 
                    datum['NumCarPrevGPLowCI'],
                ];

                chartD3HigherCI = [
                    datum['NumCarPrevU5HighCI'], 
                    datum['NumCarPrevGPHighCI'],
                ];

            } // end if country code
        });  // end forEach

        var newCDataSets = [chartCData1, chartCData2];

        chartC.data.datasets.forEach(function(dataset, i) {
            dataset.data = newCDataSets[i];
        })
        
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

        chartD3.data.datasets.forEach(function(dataset, i) {
            if(i === 0) {
                dataset.data = chartD3Data;
            } else if(i === 1) {
                dataset.data = chartD3LowerCI;
            } else if(i === 2) {
                dataset.data = chartD3HigherCI;
            } else {
                dataset.data = chartD3Data;
            }
        });

        chartD3.update();

    }

    function customTooltips(tooltip) {

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

            bodyLines.reverse();
            console.log(bodyLines)

            bodyLines.forEach(function(body, i) {
                // hacky solution to get items ordered right in tooltip
                if(i === 0) {
                    var colors = tooltip.labelColors[3];
                    var style = 'background:' + colors.backgroundColor;
                    var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                    innerHtml += '<tr><td>' + span + 'Estimated #' + body + '</td></tr>';
                } else if(i === 1) {
                    var colors = tooltip.labelColors[2];
                    console.log(colors)
                    var style = 'background:' + colors.backgroundColor;
                    style += '; border-radius: 50%';
                    var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                    innerHtml += '<tr><td>' + span + 'Upper CI #' + body + '</td></tr>';
                } else if(i === 2) {
                    var colors = tooltip.labelColors[1];
                    var style = 'background:' + colors.backgroundColor;
                    style += '; border-radius: 50%';
                    var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                    innerHtml += '<tr><td>' + span + 'Lower CI #' + body + '</td></tr>';
                }
          
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
