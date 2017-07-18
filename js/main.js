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
        $("#modal-data").modal('show');
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
                    label: "Percentage of infants vaccinated with 3 doses of Hep B (2015)",
                    borderColor: '#f3e79b',
                    fill: false
                }, 
                {
                    label: "Percentage of infants vaccinated with 3 doses of Hep B birth (2015)",
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
                borderColor: "lightgray",
                fill: false,
                pointRadius: 1
            },{
                type: "line",
                borderColor: "lightgray",
                fill: false,
                pointRadius: 1
            },
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
                fill: false,
                backgroundColor: "steelblue"
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
                    position: "nearest",
                    custom: customTooltip
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
            },
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
                backgroundColor: "steelblue"
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
                    position: "nearest",
                    custom: customTooltip
                }
            }
        });

        var chartD3Data = {
            labels: ["< 5 yrs", "General pop"],
            datasets: [{
                    type: "bar",
                    backgroundColor: "steelblue"
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
                }
            }
        });

        var currentYear = 1990,
            currentCode = "DZA";

        updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD2, chartD3);

        $('#year-dropdown').dropdown({
            on: "hover",
            onChange: function(value, text, $selectedItem) {
                currentYear = value;
                updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD2, chartD3);
            }
        });

        $('#country-dropdown').dropdown({
            on: "hover",
            onChange: function(value, text, $selectedItem) {
                currentCode = value;
                updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD2, chartD3);
                $("#dropdown-current-country").html(text);
            }
        });



    }

    function updateCharts(data, surveyData, currentYear, currentCode, chartC, chartD1, chartD2, chartD3) {

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
            var index = index1 + 1;
        } else {
            var index = index2 + 1;
        }

        var slicedLabels = chartCLabels.slice(index, chartCLabels.length);

        chartC.data.labels = slicedLabels;

        chartCData1 = chartCData1.slice(index, chartCData1.length);
        chartCData2 = chartCData2.slice(index, chartCData2.length);

        console.log(chartCData1)
        console.log(chartCData2)

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

             chartD3.data.datasets[i].data = chartD3Data;
        //     if(i === 0) {
        //         dataset.data = chartD3LowerCI;
        //     } else if(i === 1) {
        //         dataset.data = chartD3HigherCI;
        //     } else {
        //         dataset.data = chartD3Data;
        //     }
        });

       

        chartD3.update();


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
