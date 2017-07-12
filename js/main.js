(function(Chart, $){

    d3.csv('data/hepB-master.csv', function(e,d){
        makeCountryDropdown(d);
    });

    $('#year-dropdown').dropdown({
        on: "hover"
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

        var chartD1 = new Chart(ctxD1, {
            type: 'bar',
            data: {
                labels: ["pre", "post", "pre", "post"],
                datasets: [{
                    data: [3, 1.2, 3.5, 1.7]
                }]
            },
            options: {
                scaleBeginAtZero: true
            }
        });

        var ctxD2 = document.getElementById('vizD-2').getContext('2d');

        var chartD2 = new Chart(ctxD2, {
            type: 'bar',
            data: {
                labels: ["pre", "post", "pre", "post"],
                datasets: [{
                    data: [3, 1.2, 3.5, 1.7]
                }]
            },
            options: {
                scaleBeginAtZero: true
            }
        });

        var ctxD3 = document.getElementById('vizD-3').getContext('2d');

        var chartD3 = new Chart(ctxD3, {
            type: 'bar',
            data: {
                labels: ["pre", "post", "pre", "post"],
                datasets: [{
                    data: [3, 1.2, 3.5, 1.7]
                }]
            },
            options: {
                scaleBeginAtZero: true
            }
        });


        updateCharts(data, "DZA", chartC);

        $('#country-dropdown').dropdown({
            on: "hover",
            onChange: function(value, text, $selectedItem) {
                updateCharts(data, value, chartC);
            }
        });

    }

    function updateCharts(data, currentCode, chartC) {

        var chartCData1 = [],
            chartCData2 = [];

        data.forEach(function(datum) {
            if(datum.ISO3 === currentCode) {
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
            }
        });

        var newDataSets = [chartCData1, chartCData2];

        chartC.data.datasets.forEach(function(dataset, i) {
            dataset.data = newDataSets[i];
        })
        
        chartC.update();

    }



})(Chart, $);
