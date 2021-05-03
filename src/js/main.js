(function (Chart, $, d3) {
  'use strict';

  // bind "hide and show vertical menu" event to top right icon button
  $('.ui.toggle.button').on('click touchstart', function () {
    $('.ui.vertical.menu').toggle('fast', 'linear');
  });

  $('.tabvar.mobile a.tab').on('click', function () {
    $('.ui.vertical.menu').toggle('fast', 'linear');
  });

  var currentEstYear = '2015';
  var currentEstYearA = '2015';

  var hash = window.location.hash;

  if (!hash || hash === '#public-health-strategies' || hash === '#') {
    d3.selectAll(".menu .item[href='#public-health-strategies']").classed(
      'active',
      true
    );
    d3.select('#public-health-strategies').style('top', '160px');
    d3.select('#public-health-strategies')
      .classed('current-who-page', true)
      .transition()
      .style('opacity', 1);
  } else {
    d3.selectAll('.menu .item').classed('active', false);
    d3.selectAll(".menu .item[href='" + hash + "']").classed('active', true);
    d3.select('.current-who-page').classed('current-who-page', false);
    d3.select(hash).style('top', '160px');
    d3.select(hash)
      .classed('current-who-page', true)
      .transition()
      .style('opacity', '1');
  }

  d3.selectAll('.menu a.tab').on('click touchstart', function () {
    var target = d3.select(this).attr('href');

    d3.selectAll('.menu .item').classed('active', false);
    d3.selectAll(".menu .item[href='" + target + "']").classed('active', true);

    d3.select('.current-who-page')
      .transition()
      .style('opacity', '0')
      .on('end', function () {
        d3.select('.current-who-page')
          .classed('current-who-page', false)
          .style('top', '-10000px');
        d3.select(target)
          .classed('current-who-page', true)
          .style('top', '160px');
        d3.select(target).transition().style('opacity', '1');
      });
  });

  d3.selectAll('.menu .image').on('click touchstart', function () {
    d3.selectAll('.menu .item').classed('active', false);
    d3.selectAll(".menu .item[href='#public-health-strategies']").classed(
      'active',
      true
    );

    d3.select('.current-who-page')
      .transition()
      .style('opacity', '0')
      .on('end', function () {
        d3.select('.current-who-page')
          .classed('current-who-page', false)
          .style('top', '-10000px');
        d3.select('#public-health-strategies').style('top', '160px');
        d3.select('#public-health-strategies')
          .classed('current-who-page', true)
          .transition()
          .style('opacity', 1);
      });
  });

  d3.queue()
    .defer(d3.csv, './data/hepB-master-20210422.csv')
    .defer(d3.csv, './data/seroprevalence_surveys-20201115.csv')
    .defer(d3.json, './data/who-countries.json')
    .defer(d3.json, './data/iso-codes.json')
    .await(ready);

  // when data is ready
  function ready(e, hepData, surveyData, countries, isoCodes) {
    makeCountryDropdown(hepData, surveyData, isoCodes, countries);
  }

  function makeCountryDropdown(data, surveyData, isoCodes, countries) {
    // we want to reverse the codes
    // should produce new output file instead
    var swappedIso = {};

    // select empty menus
    var $menuAfro = $('#menu-afro');
    var $menuEmro = $('#menu-emro');
    var $menuEuro = $('#menu-euro');
    var $menuPaho = $('#menu-paho');
    var $menuSearo = $('#menu-searo');
    var $menuWpro = $('#menu-wpro');

    var regionAndIncomeMap = {};

    // loop through data
    data.forEach(function (datum) {
      // shortcut for code
      var dataISO = datum.ISO3;

      // shortcut for region
      var region = datum.Region;

      regionAndIncomeMap[dataISO] = {
        region: region,
        income2017: datum['income category-2017'],
        income2020: datum['income category-2020'],
      };

      // loop through codes and create swapped object
      for (var code in isoCodes) {
        var codeISO = isoCodes[code];

        if (dataISO === codeISO) {
          swappedIso[dataISO] = code;
        }
      }

      // create item
      var item =
        '<a class="item" href="#" data-value="' +
        dataISO +
        '"><i class="' +
        swappedIso[dataISO].toLowerCase() +
        ' flag"></i>' +
        datum.Country +
        '</a>';

      switch (region) {
        case 'AFRO':
          $menuAfro.append(item);
          break;
        case 'EMRO':
          $menuEmro.append(item);
          break;
        case 'EURO':
          $menuEuro.append(item);
          break;
        case 'PAHO':
          $menuPaho.append(item);
          break;
        case 'SEARO':
          $menuSearo.append(item);
          break;
        case 'WPRO':
          $menuWpro.append(item);
          break;
      }
    });
    makeTab2Charts();
    makeCharts(data, surveyData, regionAndIncomeMap, countries, isoCodes);
  }

  function makeTab2Charts() {
    var ctxGlobalA = document.getElementById('viz-global-a').getContext('2d');

    var chartGlobalAData = {
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#c62828',
          label: 'world',
        },
      ],
    };

    var chartGlobalAChart = new Chart(ctxGlobalA, {
      type: 'bar',
      data: chartGlobalAData,
      options: {
        title: {
          display: true,
        },
        legend: {
          display: false,
          position: 'top',
          fullWidth: false,
          onClick: null,
        },
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
          // custom: function (tooltip) {
          //   // let values =
          //   if (tooltip.dataPoints) {
          //     if ((currentEstYear = '2015')) {
          //       var barIndex = tooltip.dataPoints[0].index;
          //       createTooltip(
          //         this,
          //         tooltip,
          //         barIndex,
          //         [4.6, 1.3, 4.3, 3.5],
          //         [6.8, 2.2, 6.1, 5.0],
          //         [3.5, 0.9, 3.3, 2.7],
          //         '%'
          //       );
          //     } else {
          //       var barIndex = tooltip.dataPoints[0].index;
          //       createTooltip(
          //         this,
          //         tooltip,
          //         barIndex,
          //         [4.42, 0.82, 4.46, 3.62],
          //         [5.4, 1.06, 5.41, 4.2],
          //         [4.9, 0.94, 5.01, 3.89],
          //         '%'
          //       );
          //     }
          //   } else {
          //     document.getElementById('chartjs-tooltip').remove();
          //   }
          // },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 8,
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
      },
    });

    var ctxGlobalB = document.getElementById('viz-global-b').getContext('2d');

    var chartGlobalBData = {
      labels: ['Pre-vac', '2015 est.', 'Pre-vac', '2015 est.'],
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#c62828',
          label: 'world',
        },
      ],
    };

    var chartGlobalBChart = new Chart(ctxGlobalB, {
      type: 'bar',
      data: chartGlobalBData,
      options: {
        title: {
          display: true,
        },
        legend: {
          display: false,
          position: 'top',
          fullWidth: false,
          onClick: null,
        },
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return value
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
      },
    });

    var ctxGlobalC = document.getElementById('viz-global-c').getContext('2d');

    var chartGlobalCData = {
      labels: ['Under 5 yrs', 'All Ages'],
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#2196f3',
          label: 'world',
        },
      ],
    };

    var chartGlobalCChart = new Chart(ctxGlobalC, {
      type: 'bar',
      data: chartGlobalCData,
      options: {
        title: {
          display: true,
        },
        legend: {
          display: false,
          position: 'top',
          fullWidth: false,
          onClick: null,
        },
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 120000,
                callback: function (value, index, values) {
                  return value
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
      },
    });

    updateTab2Charts(chartGlobalAChart, chartGlobalBChart, chartGlobalCChart);

    d3.selectAll('.toggle-page2 button').on('click', function () {
      var currentButton = d3.select(this);
      if (currentButton.classed('primary')) {
        // silence
      } else {
        if (d3.select(this).classed('est-2015')) {
          d3.selectAll('.toggle-page2 .est-2015').classed('primary', true);
          d3.selectAll('.toggle-page2 .est-2019').classed('primary', false);
          currentEstYearA = '2015';
        } else {
          console.log('yes 2019');
          d3.selectAll('.toggle-page2 .est-2015').classed('primary', false);
          d3.selectAll('.toggle-page2 .est-2019').classed('primary', true);
          currentEstYearA = '2019';
        }

        updateTab2Charts(
          chartGlobalAChart,
          chartGlobalBChart,
          chartGlobalCChart
        );
      }
    });
  }

  function updateTab2Charts(chartA, chartB, chartC) {
    chartA.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        if (currentEstYearA == '2015') {
          createTooltip(
            this,
            tooltip,
            barIndex,
            [4.6, 1.3, 4.3, 3.5],
            [6.8, 2.2, 6.1, 5.0],
            [3.5, 0.9, 3.3, 2.7],
            '%'
          );
        } else {
          createTooltip(
            this,
            tooltip,
            barIndex,
            [4.9, 0.94, 5.01, 3.89],
            [5.4, 1.06, 5.41, 4.2],
            [4.42, 0.82, 4.46, 3.62],
            '%'
          );
        }
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartB.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        if (currentEstYearA == '2015') {
          createTooltip(
            this,
            tooltip,
            barIndex,
            [23162, 6098, 240769, 199231],
            [45456, 14589, 442995, 367134],
            [23162, 6098, 240769, 199231],
            '#'
          );
        } else {
          createTooltip(
            this,
            tooltip,
            barIndex,
            [31036, 8922, 310367, 256640],
            [45456, 14589, 442995, 367134],
            [23162, 6098, 240769, 199231],
            '#'
          );
        }
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartC.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        if (currentEstYearA == '2015') {
          createTooltip(
            this,
            tooltip,
            barIndex,
            [22067, 76818],
            [32149, 111884],
            [15856, 57615],
            '#'
          );
        } else {
          createTooltip(
            this,
            tooltip,
            barIndex,
            [26855.1, 79413],
            [29798.6, 86994.5],
            [23935, 72427.7],
            '#'
          );
        }
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    if (currentEstYearA == '2015') {
      chartA.data.labels = ['Pre-vac', '2015 est.', 'Pre-vac', '2015 est.'];
      chartA.data.datasets[0].data = [3.5, 0.9, 3.3, 2.7];
      chartA.data.datasets[1].data = [6.8, 2.2, 6.1, 5.0];
      chartA.data.datasets[2].data = [4.6, 1.3, 4.3, 3.5];

      chartB.data.labels = ['Pre-vac', '2015 est.', 'Pre-vac', '2015 est.'];
      chartB.data.datasets[0].data = [23162, 6098, 240769, 199231];
      chartB.data.datasets[1].data = [45456, 14589, 442995, 367134];
      chartB.data.datasets[2].data = [23162, 6098, 240769, 199231];

      chartC.data.datasets[0].data = [15856, 57615];
      chartC.data.datasets[1].data = [32149, 111884];
      chartC.data.datasets[2].data = [22067, 76818];
    } else {
      chartA.data.labels = ['Pre-vac', '2019 est.', 'Pre-vac', '2019 est.'];
      chartA.data.datasets[0].data = [4.42, 0.82, 4.46, 3.62];
      chartA.data.datasets[1].data = [5.4, 1.06, 5.41, 4.2];
      chartA.data.datasets[2].data = [4.9, 0.94, 5.01, 3.89];

      chartB.data.labels = ['Pre-vac', '2019 est.', 'Pre-vac', '2019 est.'];
      chartB.data.datasets[0].data = [29954.1, 5583.8, 240769, 330250.1];
      chartB.data.datasets[1].data = [36576.6, 7157.2, 442995, 384691.9];
      chartB.data.datasets[2].data = [33196.3, 6349.3, 356439.5, 277012.2];

      chartC.data.datasets[0].data = [23935, 72427.7];
      chartC.data.datasets[1].data = [29798.6, 86994.5];
      chartC.data.datasets[2].data = [26855.1, 79413];
    }

    chartA.update();
    chartB.update();
    chartC.update();
  }

  function makeCharts(
    data,
    surveyData,
    regionAndIncomeMap,
    countries,
    isoCodes
  ) {
    var ctxC = document.getElementById('vizC').getContext('2d');

    var chartC = new Chart(ctxC, {
      type: 'line',
      data: {
        datasets: [
          {
            label: '% infants vaccinated with birth dose of Hep B',
            borderColor: '#f9a825',
            pointBackgroundColor: '#f9a825',
            fill: false,
          },
          {
            label: '% infants vaccinated with 3 doses of Hep B',
            borderColor: '#2196f3',
            pointBackgroundColor: '#2196f3',
            fill: false,
          },
        ],
      },
      options: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
          },
          onClick: null,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 100,
              },
            },
          ],
        },
        tooltips: {
          enabled: false,
        },
      },
    });

    var ctxD1 = document.getElementById('vizD-1').getContext('2d');

    var chartD1Data = {
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#c62828',
        },
      ],
    };

    var chartD1 = new Chart(ctxD1, {
      type: 'bar',
      data: chartD1Data,
      options: {
        title: {
          display: false,
        },
        legend: false,
        scales: {
          yAxes: [
            {
              min: 0,
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
      },
    });

    var ctxD1B = document.getElementById('vizD-1b').getContext('2d');

    var chartD1BData = {
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#7e57c2',
          label: 'region',
        },
      ],
    };

    var chartD1B = new Chart(ctxD1B, {
      type: 'bar',
      data: chartD1BData,
      options: {
        title: {
          display: false,
        },
        legend: false,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
      },
    });

    var ctxD1C = document.getElementById('vizD-1c').getContext('2d');

    var chartD1CData = {
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#26a69a',
          label: 'income',
        },
      ],
    };

    var chartD1C = new Chart(ctxD1C, {
      type: 'bar',
      data: chartD1CData,
      options: {
        title: {
          display: false,
        },
        legend: false,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
      },
    });

    var chartD2Data = {
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#c62828',
        },
      ],
    };

    var ctxD2 = document.getElementById('vizD-2').getContext('2d');

    var chartD2 = new Chart(ctxD2, {
      type: 'bar',
      data: chartD2Data,
      options: {
        scaleBeginAtZero: true,
        title: {
          display: false,
        },
        legend: false,
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return value
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
      },
    });

    var ctxD2B = document.getElementById('vizD-2b').getContext('2d');

    var chartD2BData = {
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#7e57c2',
          label: 'region',
        },
      ],
    };

    var chartD2B = new Chart(ctxD2B, {
      type: 'bar',
      data: chartD2BData,
      options: {
        scaleBeginAtZero: true,
        title: {
          display: false,
        },
        legend: false,
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return value
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
      },
    });

    var ctxD2C = document.getElementById('vizD-2c').getContext('2d');

    var chartD2CData = {
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#26a69a',
          label: 'income',
        },
      ],
    };

    var chartD2C = new Chart(ctxD2C, {
      type: 'bar',
      data: chartD2CData,
      options: {
        scaleBeginAtZero: true,
        title: {
          display: false,
        },
        legend: false,
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return value
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
      },
    });

    var chartD3Data = {
      labels: ['Under 5 yrs', 'All Ages'],
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#2196f3',
        },
      ],
    };

    var ctxD3 = document.getElementById('vizD-3').getContext('2d');

    var chartD3 = new Chart(ctxD3, {
      type: 'bar',
      data: chartD3Data,
      options: {
        title: {
          display: false,
        },
        legend: false,
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return value
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
      },
    });

    var chartD3BData = {
      labels: ['Under 5 yrs', 'All Ages'],
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#7e57c2',
          label: 'region',
        },
      ],
    };

    var ctxD3B = document.getElementById('vizD-3b').getContext('2d');

    var chartD3B = new Chart(ctxD3B, {
      type: 'bar',
      data: chartD3BData,
      options: {
        title: {
          display: false,
        },
        legend: false,
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return value
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
      },
    });

    var chartD3CData = {
      labels: ['Under 5 yrs', 'All Ages'],
      datasets: [
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'line',
          pointBackgroundColor: '#f57f17',
          showLine: false,
          fill: false,
          pointRadius: 3,
        },
        {
          type: 'bar',
          backgroundColor: '#26a69a',
          label: 'income',
        },
      ],
    };

    var ctxD3C = document.getElementById('vizD-3c').getContext('2d');

    var chartD3C = new Chart(ctxD3C, {
      type: 'bar',
      data: chartD3CData,
      options: {
        scaleBeginAtZero: true,
        title: {
          display: false,
        },
        legend: false,
        tooltips: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return value
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
      },
    });

    var currentYear = 2015;
    var currentCode = 'AGO';

    updateChartA(data, currentYear, currentCode);
    updateCharts(
      data,
      currentCode,
      chartC,
      chartD1,
      chartD1B,
      chartD1C,
      chartD2,
      chartD2B,
      chartD2C,
      chartD3,
      chartD3B,
      chartD3C
    );
    updateChartE(surveyData, currentCode);
    makeMap(data, countries, regionAndIncomeMap, isoCodes);

    $('#year-dropdown').dropdown({
      on: 'hover',
      onChange: function (value) {
        currentYear = value;
        updateChartA(data, currentYear, currentCode);
      },
    });

    $('.current-country').html('<i class="ao flag"></i> Angola');
    $('.regional-group').html(regionAndIncomeMap[currentCode].region);

    if (currentEstYear == '2015') {
      $('.income-group').html(regionAndIncomeMap[currentCode].income2017);
    } else {
      $('.income-group').html(regionAndIncomeMap[currentCode].income2020);
    }

    $('#country-dropdown').dropdown({
      on: 'hover',
      onChange: function (value, text) {
        currentCode = value;
        updateChartA(data, currentYear, currentCode);
        updateCharts(
          data,
          currentCode,
          chartC,
          chartD1,
          chartD1B,
          chartD1C,
          chartD2,
          chartD2B,
          chartD2C,
          chartD3,
          chartD3B,
          chartD3C
        );
        updateChartE(surveyData, currentCode);
        $('#dropdown-current-country').html(text);
        $('.current-country').html(text);
        $('.regional-group').html(regionAndIncomeMap[currentCode].region);
        if (currentEstYear == '2015') {
          $('.income-group').html(regionAndIncomeMap[currentCode].income2017);
        } else {
          $('.income-group').html(regionAndIncomeMap[currentCode].income2020);
        }
      },
    });

    d3.selectAll('.toggle-page3 button').on('click', function () {
      var currentButton = d3.select(this);
      if (currentButton.classed('primary')) {
        // silence
      } else {
        if (d3.select(this).classed('est-2015')) {
          d3.selectAll('.toggle-page3 .est-2015').classed('primary', true);
          d3.selectAll('.toggle-page3 .est-2019').classed('primary', false);
          currentEstYear = '2015';
        } else {
          d3.selectAll('.toggle-page3 .est-2015').classed('primary', false);
          d3.selectAll('.toggle-page3 .est-2019').classed('primary', true);
          currentEstYear = '2019';
        }
        updateCharts(
          data,
          currentCode,
          chartC,
          chartD1,
          chartD1B,
          chartD1C,
          chartD2,
          chartD2B,
          chartD2C,
          chartD3,
          chartD3B,
          chartD3C
        );
      }
      if (currentEstYear == '2015') {
        $('.income-group').html(regionAndIncomeMap[currentCode].income2017);
      } else {
        $('.income-group').html(regionAndIncomeMap[currentCode].income2020);
      }
    });
  }

  function updateChartA(data, currentYear, currentCode) {
    var birthYearIntervals = {
      'births-1980-1985': [1980, 1985],
      'births-1985-1990': [1986, 1990],
      'births-1990-1995': [1991, 1995],
      'births-1995-2000': [1996, 2000],
      'births-2000-2005': [2001, 2005],
      'births-2005-2010': [2006, 2010],
      'births-2010-2015': [2011, 2015],
      'births-2015-2020': [2016, 2020],
    };

    var infantMortalityIntervals = {
      'InfMort1985-1990': [1985, 1990],
      'InfMort1990-1995': [1991, 1995],
      'InfMort1995-2000': [1996, 2000],
      'InfMort2000-2005': [2001, 2005],
      'InfMort2005-2010': [2006, 2010],
      'InfMort2010-2015': [2011, 2015],
      'InfMort2015-2020': [2016, 2020],
    };

    // CHART A selections

    var $totalPop = $('#chartA-total-pop');
    var $totalPopU5 = $('#chartA-total-pop-u5');
    var $births = $('#chartA-births');
    var $infantMortality = $('#chartA-infant-mortality');
    var $urbanPop = $('#chartA-urban-population');
    var $birthsAttended = $('#chartA-births-attended');
    var $birthsAttendedYear = $('#chartA-births-attended-year');

    $('#total-pop-year').html('(' + currentYear + ')');
    $('#urban-pop-years').html('(' + currentYear + ')');

    data.forEach(function (datum) {
      // acccess data for current country
      if (datum.ISO3 === currentCode) {
        // CHART A

        $totalPop.html((datum['pop' + currentYear] * 1000).toLocaleString());

        for (var i = 1990; i <= 2020; i += 5) {
          if (currentYear >= i) {
            $totalPopU5.html((datum['U5' + i] * 1000).toLocaleString());
            $urbanPop.html(Math.round(datum['UrbPop' + i] * 10) / 10 + '%');
            $('#under-five-pop-years').html('(' + i + ')');
          }
        }

        if ($totalPopU5 === '') {
          $totalPopU5.html('N/A');
        }

        for (var interval in birthYearIntervals) {
          if (
            +currentYear >= birthYearIntervals[interval][0] &&
            +currentYear <= birthYearIntervals[interval][1]
          ) {
            $births.html((datum[interval] * 1000).toLocaleString());
            $('#birth-years').html(
              '(' +
                (birthYearIntervals[interval][0] - 1) +
                ' &ndash; ' +
                birthYearIntervals[interval][1] +
                ')'
            );
          }
        }

        if ($births.html() === '') {
          $births.html('N/A');
        }

        for (var interval in infantMortalityIntervals) {
          if (
            +currentYear >= infantMortalityIntervals[interval][0] &&
            +currentYear <= infantMortalityIntervals[interval][1]
          ) {
            $infantMortality.html(
              Math.round(datum[interval] * 10) / 10 + ' per 1,000'
            );
            $('#infant-mortality-years').html(
              '(' +
                (infantMortalityIntervals[interval][0] - 1) +
                ' &ndash; ' +
                infantMortalityIntervals[interval][1] +
                ')'
            );
          }
        }

        if ($births.html() === '') {
          $infantMortality.html('N/A');
        }

        if (datum['BirthSkilledPer']) {
          $birthsAttended.html(datum['BirthSkilledPer']);
        } else {
          $birthsAttended.html('N/A');
        }

        if (datum['BirthSkilledYear']) {
          $birthsAttendedYear.html('(' + datum['BirthSkilledYear'] + ')');
        }
      }
    });
  }

  function updateCharts(
    data,
    currentCode,
    chartC,
    chartD1,
    chartD1B,
    chartD1C,
    chartD2,
    chartD2B,
    chartD2C,
    chartD3,
    chartD3B,
    chartD3C
  ) {
    // CHART B selections

    var $hepBIntroYear = $('#chartB-hepB-intro-year');
    var $hepBBirthYear = $('#chartB-hepB-birth-year');
    var $chartBSchedule = $('#chartB-schedule');
    var $chartBType = $('#chartB-type');

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

    data.forEach(function (datum) {
      // acccess data for current country
      if (datum.ISO3 === currentCode) {
        // CHART B

        $hepBIntroYear.html(Math.round(datum.HepBintroduced));
        $hepBBirthYear.html(Math.round(datum.HepBintroducedBirth));

        if (datum.Schedule) {
          $chartBSchedule.html(datum.Schedule);
        } else {
          $chartBSchedule.html('N/A');
        }

        $chartBType.html(datum.Type);

        // CHART C
        for (var i = 1990; i <= 2019; i++) {
          if (datum['Cov_HepB_BD_' + i]) {
            chartCData1.push(datum['Cov_HepB_BD_' + i]);
          } else {
            chartCData1.push(null);
          }

          if (datum['Cov_HepB3_' + i]) {
            chartCData2.push(datum['Cov_HepB3_' + i]);
          } else {
            chartCData2.push(null);
          }

          chartCLabels.push(String(i));
        }

        // CHART D

        if (currentEstYear == '2015') {
          chartD1Data = [
            datum['PreVer1U5EstPer'],
            datum['PostVer1U5EstPer'],
            datum['PreVer1GPEstPer'],
            datum['PostVer1GPEstPer'],
          ];

          chartD1LowerCI = [
            datum['PreVer1U5EstPerLowCI'],
            datum['PostVer1U5EstPerLowCI'],
            datum['PreVer1GPEstPerLowCI'],
            datum['PostVer1GPEstPerLowCI'],
          ];

          chartD1UpperCI = [
            datum['PreVer1U5EstPerHighCI'],
            datum['PostVer1U5EstPerHighCI'],
            datum['PreVer1GPEstPerHighCI'],
            datum['PostVer1GPEstPerHighCI'],
          ];

          chartD1BData = [
            datum['PreVer1U5EstPer-region'],
            datum['PostVer1U5EstPer-region'],
            datum['PreVer1GPEstPer-region'],
            datum['PostVer1GPEstPer-region'],
          ];

          chartD1BLowerCI = [
            datum['PreVer1U5EstPerLowCI-region'],
            datum['PostVer1U5EstPerLowCI-region'],
            datum['PreVer1GPEstPerLowCI-region'],
            datum['PostVer1GPEstPerLowCI-region'],
          ];

          chartD1BUpperCI = [
            datum['PreVer1U5EstPerHighCI-region'],
            datum['PostVer1U5EstPerHighCI-region'],
            datum['PreVer1GPEstPerHighCI-region'],
            datum['PostVer1GPEstPerHighCI-region'],
          ];

          chartD1CData = [
            datum['PreVer1U5EstPer-income'],
            datum['PostVer1U5EstPer-income'],
            datum['PreVer1GPEstPer-income'],
            datum['PostVer1GPEstPer-income'],
          ];

          chartD1CLowerCI = [
            datum['PreVer1U5EstPerLowCI-income'],
            datum['PostVer1U5EstPerLowCI-income'],
            datum['PreVer1GPEstPerLowCI-income'],
            datum['PostVer1GPEstPerLowCI-income'],
          ];

          chartD1CUpperCI = [
            datum['PreVer1U5EstPerHighCI-income'],
            datum['PostVer1U5EstPerHighCI-income'],
            datum['PreVer1GPEstPerHighCI-income'],
            datum['PostVer1GPEstPerHighCI-income'],
          ];

          chartD2Data = [
            datum['PreVer1U5EstCar'] * 1000,
            datum['PostVer1U5EstCar'] * 1000,
            datum['PreVer1GPEstCar'] * 1000,
            datum['PostVer1GPEstCar'] * 1000,
          ];

          chartD2LowerCI = [
            datum['PreVer1U5EstCarLowCI'] * 1000,
            datum['PostVer1U5EstCarLowCI'] * 1000,
            datum['PreVer1GPEstCarLowCI'] * 1000,
            datum['PostVer1GPEstCarLowCI'] * 1000,
          ];

          chartD2UpperCI = [
            datum['PreVer1U5EstCarHighCI'] * 1000,
            datum['PostVer1U5EstCarHighCI'] * 1000,
            datum['PreVer1GPEstCarHighCI'] * 1000,
            datum['PostVer1GPEstCarHighCI'] * 1000,
          ];

          chartD2BData = [
            datum['PreVer1U5EstCar-region'] * 1000,
            datum['PostVer1U5EstCar-region'] * 1000,
            datum['PreVer1GPEstCar-region'] * 1000,
            datum['PostVer1GPEstCar-region'] * 1000,
          ];

          chartD2BLowerCI = [
            datum['PreVer1U5EstCarLowCI-region'] * 1000,
            datum['PostVer1U5EstCarLowCI-region'] * 1000,
            datum['PreVer1GPEstCarLowCI-region'] * 1000,
            datum['PostVer1GPEstCarLowCI-region'] * 1000,
          ];

          chartD2BUpperCI = [
            datum['PreVer1U5EstCarHighCI-region'] * 1000,
            datum['PostVer1U5EstCarHighCI-region'] * 1000,
            datum['PreVer1GPEstCarHighCI-region'] * 1000,
            datum['PostVer1GPEstCarHighCI-region'] * 1000,
          ];

          chartD2CData = [
            datum['PreVer1U5EstCar-income'] * 1000,
            datum['PostVer1U5EstCar-income'] * 1000,
            datum['PreVer1GPEstCar-income'] * 1000,
            datum['PostVer1GPEstCar-income'] * 1000,
          ];

          chartD2CLowerCI = [
            datum['PreVer1U5EstCarLowCI-income'] * 1000,
            datum['PostVer1U5EstCarLowCI-income'] * 1000,
            datum['PreVer1GPEstCarLowCI-income'] * 1000,
            datum['PostVer1GPEstCarLowCI-income'] * 1000,
          ];

          chartD2CUpperCI = [
            datum['PreVer1U5EstCarHighCI-income'] * 1000,
            datum['PostVer1U5EstCarHighCI-income'] * 1000,
            datum['PreVer1GPEstCarHighCI-income'] * 1000,
            datum['PostVer1GPEstCarHighCI-income'] * 1000,
          ];

          chartD3Data = [
            datum['NumCarPreventVer1U5'] * 1000,
            datum['NumCarPreventVer1GP'] * 1000,
          ];

          chartD3LowerCI = [
            datum['NumCarPreventVer1U5LowCI'] * 1000,
            datum['NumCarPreventVer1GPLowCI'] * 1000,
          ];

          chartD3UpperCI = [
            datum['NumCarPreventVer1U5HighCI'] * 1000,
            datum['NumCarPreventVer1GPHighCI'] * 1000,
          ];

          chartD3BData = [
            datum['NumCarPreventVer1U5-region'] * 1000,
            datum['NumCarPreventVer1GP-region'] * 1000,
          ];

          chartD3BLowerCI = [
            datum['NumCarPreventVer1U5LowCI-region'] * 1000,
            datum['NumCarPreventVer1GPLowCI-region'] * 1000,
          ];

          chartD3BUpperCI = [
            datum['NumCarPreventVer1U5HighCI-region'] * 1000,
            datum['NumCarPreventVer1GPHighCI-region'] * 1000,
          ];

          chartD3CData = [
            datum['NumCarPreventVer1U5-income'] * 1000,
            datum['NumCarPreventVer1GP-income'] * 1000,
          ];

          chartD3CLowerCI = [
            datum['NumCarPreventVer1U5LowCI-income'] * 1000,
            datum['NumCarPreventVer1GPLowCI-income'] * 1000,
          ];

          chartD3CUpperCI = [
            datum['NumCarPreventVer1U5HighCI-income'] * 1000,
            datum['NumCarPreventVer1GPHighCI-income'] * 1000,
          ];
          //  otherwise it's 2019
        } else {
          chartD1Data = [
            datum['PreVer2U5EstPer'],
            datum['PostVer2U5EstPer'],
            datum['PreVer2GPEstPer'],
            datum['PostVer2GPEstPer'],
          ];

          chartD1LowerCI = [
            datum['PreVer2U5EstPerLowCI'],
            datum['PostVer2U5EstPerLowCI'],
            datum['PreVer2GPEstPerLowCI'],
            datum['PostVer2GPEstPerLowCI'],
          ];

          chartD1UpperCI = [
            datum['PreVer2U5EstPerHighCI'],
            datum['PostVer2U5EstPerHighCI'],
            datum['PreVer2GPEstPerHighCI'],
            datum['PostVer2GPEstPerHighCI'],
          ];

          // Chart D1 B

          chartD1BData = [
            datum['PreVer2U5EstPer-region'],
            datum['PostVer2U5EstPer-region'],
            datum['PreVer2GPEstPer-region'],
            datum['PostVer2GPEstPer-region'],
          ];

          chartD1BLowerCI = [
            datum['PreVer2U5EstPerLowCI-region'],
            datum['PostVer2U5EstPerLowCI-region'],
            datum['PreVer2GPEstPerLowCI-region'],
            datum['PostVer2GPEstPerLowCI-region'],
          ];

          chartD1BUpperCI = [
            datum['PreVer2U5EstPerHighCI-region'],
            datum['PostVer2U5EstPerHighCI-region'],
            datum['PreVer2GPEstPerHighCI-region'],
            datum['PostVer2GPEstPerHighCI-region'],
          ];

          chartD1CData = [
            datum['PreVer2U5EstPer-income'],
            datum['PostVer2U5EstPer-income'],
            datum['PreVer2GPEstPer-income'],
            datum['PostVer2GPEstPer-income'],
          ];

          chartD1CLowerCI = [
            datum['PreVer2U5EstPerLowCI-income'],
            datum['PostVer2U5EstPerLowCI-income'],
            datum['PreVer2GPEstPerLowCI-income'],
            datum['PostVer2GPEstPerLowCI-income'],
          ];

          chartD1CUpperCI = [
            datum['PreVer2U5EstPerHighCI-income'],
            datum['PostVer2U5EstPerHighCI-income'],
            datum['PreVer2GPEstPerHighCI-income'],
            datum['PostVer2GPEstPerHighCI-income'],
          ];

          chartD2Data = [
            datum['PreVer2U5EstCar'] * 1000,
            datum['PostVer2U5EstCar'] * 1000,
            datum['PreVer2GPEstCar'] * 1000,
            datum['PostVer2GPEstCar'] * 1000,
          ];

          chartD2LowerCI = [
            datum['PreVer2U5EstCarLowCI'] * 1000,
            datum['PostVer2U5EstCarLowCI'] * 1000,
            datum['PreVer2GPEstCarLowCI'] * 1000,
            datum['PostVer2GPEstCarLowCI'] * 1000,
          ];

          chartD2UpperCI = [
            datum['PreVer2U5EstCarHighCI'] * 1000,
            datum['PostVer2U5EstCarHighCI'] * 1000,
            datum['PreVer2GPEstCarHighCI'] * 1000,
            datum['PostVer2GPEstCarHighCI'] * 1000,
          ];

          chartD2BData = [
            datum['PreVer2U5EstCar-region'] * 1000,
            datum['PostVer2U5EstCar-region'] * 1000,
            datum['PreVer2GPEstCar-region'] * 1000,
            datum['PostVer2GPEstCar-region'] * 1000,
          ];

          chartD2BLowerCI = [
            datum['PreVer2U5EstCarLowCI-region'] * 1000,
            datum['PostVer2U5EstCarLowCI-region'] * 1000,
            datum['PreVer2GPEstCarLowCI-region'] * 1000,
            datum['PostVer2GPEstCarLowCI-region'] * 1000,
          ];

          chartD2BUpperCI = [
            datum['PreVer2U5EstCarHighCI-region'] * 1000,
            datum['PostVer2U5EstCarHighCI-region'] * 1000,
            datum['PreVer2GPEstCarHighCI-region'] * 1000,
            datum['PostVer2GPEstCarHighCI-region'] * 1000,
          ];

          chartD2CData = [
            datum['PreVer2U5EstCar-income'] * 1000,
            datum['PostVer2U5EstCar-income'] * 1000,
            datum['PreVer2GPEstCar-income'] * 1000,
            datum['PostVer2GPEstCar-income'] * 1000,
          ];

          chartD2CLowerCI = [
            datum['PreVer2U5EstCarLowCI-income'] * 1000,
            datum['PostVer2U5EstCarLowCI-income'] * 1000,
            datum['PreVer2GPEstCarLowCI-income'] * 1000,
            datum['PostVer2GPEstCarLowCI-income'] * 1000,
          ];

          chartD2CUpperCI = [
            datum['PreVer2U5EstCarHighCI-income'] * 1000,
            datum['PostVer2U5EstCarHighCI-income'] * 1000,
            datum['PreVer2GPEstCarHighCI-income'] * 1000,
            datum['PostVer2GPEstCarHighCI-income'] * 1000,
          ];

          chartD3Data = [
            datum['NumCarPreventVer2U5'] * 1000,
            datum['NumCarPreventVer2GP'] * 1000,
          ];

          chartD3LowerCI = [
            datum['NumCarPreventVer2U5LowCI'] * 1000,
            datum['NumCarPreventVer2GPLowCI'] * 1000,
          ];

          chartD3UpperCI = [
            datum['NumCarPreventVer2U5HighCI'] * 1000,
            datum['NumCarPreventVer2GPHighCI'] * 1000,
          ];

          chartD3BData = [
            datum['NumCarPreventVer2U5-region'] * 1000,
            datum['NumCarPreventVer2GP-region'] * 1000,
          ];

          chartD3BLowerCI = [
            datum['NumCarPreventVer2U5LowCI-region'] * 1000,
            datum['NumCarPreventVer2GPLowCI-region'] * 1000,
          ];

          chartD3BUpperCI = [
            datum['NumCarPreventVer2U5HighCI-region'] * 1000,
            datum['NumCarPreventVer2GPHighCI-region'] * 1000,
          ];

          chartD3CData = [
            datum['NumCarPreventVer2U5-income'] * 1000,
            datum['NumCarPreventVer2GP-income'] * 1000,
          ];

          chartD3CLowerCI = [
            datum['NumCarPreventVer2U5LowCI-income'] * 1000,
            datum['NumCarPreventVer2GPLowCI-income'] * 1000,
          ];

          chartD3CUpperCI = [
            datum['NumCarPreventVer2U5HighCI-income'] * 1000,
            datum['NumCarPreventVer2GPHighCI-income'] * 1000,
          ];
        }
      } // end if country code
    }); // end forEach

    var bothD1UpperCIs;
    var bothD2UpperCIs;
    var bothD2BUpperCIs;
    var bothD2CUpperCIs;
    var bothD3UpperCIs;
    var bothD3BUpperCIs;
    var bothD3CUpperCIs;

    data.forEach(function (datum) {
      // acccess data for current country
      if (datum.ISO3 === currentCode) {
        bothD1UpperCIs = [
          +datum['PreVer1U5EstPerHighCI'],
          +datum['PostVer1U5EstPerHighCI'],
          +datum['PreVer1GPEstPerHighCI'],
          +datum['PostVer1GPEstPerHighCI'],
          +datum['PreVer1U5EstPerHighCI-region'],
          +datum['PostVer1U5EstPerHighCI-region'],
          +datum['PreVer1GPEstPerHighCI-region'],
          +datum['PostVer1GPEstPerHighCI-region'],
          +datum['PreVer1U5EstPerHighCI-income'],
          +datum['PostVer1U5EstPerHighCI-income'],
          +datum['PreVer1GPEstPerHighCI-income'],
          +datum['PostVer1GPEstPerHighCI-income'],
          +datum['PreVer2U5EstPerHighCI'],
          +datum['PostVer2U5EstPerHighCI'],
          +datum['PreVer2GPEstPerHighCI'],
          +datum['PostVer2GPEstPerHighCI'],
          +datum['PreVer2U5EstPerHighCI-region'],
          +datum['PostVer2U5EstPerHighCI-region'],
          +datum['PreVer2GPEstPerHighCI-region'],
          +datum['PostVer2GPEstPerHighCI-region'],
          +datum['PreVer2U5EstPerHighCI-income'],
          +datum['PostVer2U5EstPerHighCI-income'],
          +datum['PreVer2GPEstPerHighCI-income'],
          +datum['PostVer2GPEstPerHighCI-income'],
        ];

        bothD2UpperCIs = [
          +datum['PreVer1U5EstCarHighCI'] * 1000,
          +datum['PostVer1U5EstCarHighCI'] * 1000,
          +datum['PreVer1GPEstCarHighCI'] * 1000,
          +datum['PostVer1GPEstCarHighCI'] * 1000,
          +datum['PreVer2U5EstCarHighCI'] * 1000,
          +datum['PostVer2U5EstCarHighCI'] * 1000,
          +datum['PreVer2GPEstCarHighCI'] * 1000,
          +datum['PostVer2GPEstCarHighCI'] * 1000,
        ];

        bothD2BUpperCIs = [
          +datum['PreVer1U5EstCarHighCI-region'] * 1000,
          +datum['PostVer1U5EstCarHighCI-region'] * 1000,
          +datum['PreVer1GPEstCarHighCI-region'] * 1000,
          +datum['PostVer1GPEstCarHighCI-region'] * 1000,
          +datum['PreVer2U5EstCarHighCI-region'] * 1000,
          +datum['PostVer2U5EstCarHighCI-region'] * 1000,
          +datum['PreVer2GPEstCarHighCI-region'] * 1000,
          +datum['PostVer2GPEstCarHighCI-region'] * 1000,
        ];

        bothD2CUpperCIs = [
          +datum['PreVer1U5EstCarHighCI-income'] * 1000,
          +datum['PostVer1U5EstCarHighCI-income'] * 1000,
          +datum['PreVer1GPEstCarHighCI-income'] * 1000,
          +datum['PostVer1GPEstCarHighCI-income'] * 1000,
          +datum['PreVer2U5EstCarHighCI-income'] * 1000,
          +datum['PostVer2U5EstCarHighCI-income'] * 1000,
          +datum['PreVer2GPEstCarHighCI-income'] * 1000,
          +datum['PostVer2GPEstCarHighCI-income'] * 1000,
        ];

        bothD3UpperCIs = [
          +datum['NumCarPreventVer2U5HighCI'] * 1000,
          +datum['NumCarPreventVer2GPHighCI'] * 1000,
          +datum['NumCarPreventVer1U5HighCI'] * 1000,
          +datum['NumCarPreventVer1GPHighCI'] * 1000,
        ];
        bothD3BUpperCIs = [
          +datum['NumCarPreventVer2U5HighCI-region'] * 1000,
          +datum['NumCarPreventVer2GPHighCI-region'] * 1000,
          +datum['NumCarPreventVer1U5HighCI-region'] * 1000,
          +datum['NumCarPreventVer1GPHighCI-region'] * 1000,
        ];
        bothD3CUpperCIs = [
          +datum['NumCarPreventVer2U5HighCI-income'] * 1000,
          +datum['NumCarPreventVer2GPHighCI-income'] * 1000,
          +datum['NumCarPreventVer1U5HighCI-income'] * 1000,
          +datum['NumCarPreventVer1GPHighCI-income'] * 1000,
        ];
      }
    });

    var maxChartDValue = Math.round(
      Math.max(...bothD1UpperCIs) + Math.max(...bothD1UpperCIs) / 5
    );
    chartD1.options.scales.yAxes[0].ticks.max = maxChartDValue;
    chartD1B.options.scales.yAxes[0].ticks.max = maxChartDValue;
    chartD1C.options.scales.yAxes[0].ticks.max = maxChartDValue;

    var maxChartD2Value = Math.max(...bothD2UpperCIs);
    var maxChartD2BValue = Math.max(...bothD2BUpperCIs);
    var maxChartD2CValue = Math.max(...bothD2CUpperCIs);

    maxChartD2Value =
      Math.round((maxChartD2Value + maxChartD2Value / 4) / 100000) * 100000;
    maxChartD2BValue =
      Math.round((maxChartD2BValue + maxChartD2BValue / 4) / 100000) * 100000;
    maxChartD2CValue =
      Math.round((maxChartD2CValue + maxChartD2CValue / 4) / 100000) * 100000;

    chartD2.options.scales.yAxes[0].ticks.max = maxChartD2Value;
    chartD2B.options.scales.yAxes[0].ticks.max = maxChartD2BValue;
    chartD2C.options.scales.yAxes[0].ticks.max = maxChartD2CValue;

    var maxChartD3Value = Math.max(...bothD3UpperCIs);
    var maxChartD3BValue = Math.max(...bothD3BUpperCIs);
    var maxChartD3CValue = Math.max(...bothD3CUpperCIs);

    maxChartD2Value =
      Math.round((maxChartD3Value + maxChartD3Value / 4) / 100000) * 100000;
    maxChartD2BValue =
      Math.round((maxChartD3BValue + maxChartD3BValue / 4) / 100000) * 100000;
    maxChartD2CValue =
      Math.round((maxChartD3CValue + maxChartD3CValue / 4) / 100000) * 100000;

    chartD3.options.scales.yAxes[0].ticks.max = maxChartD3Value;
    chartD3B.options.scales.yAxes[0].ticks.max = maxChartD3BValue;
    chartD3C.options.scales.yAxes[0].ticks.max = maxChartD3CValue;

    // LABELS

    if (currentEstYear == '2015') {
      var labels = ['Pre-vac', '2015 est.', 'Pre-vac', '2015 est.'];
    } else {
      var labels = ['Pre-vac', '2019 est.', 'Pre-vac', '2019 est.'];
    }
    chartD1.data.labels = labels;
    chartD1B.data.labels = labels;
    chartD1C.data.labels = labels;
    chartD2.data.labels = labels;
    chartD2B.data.labels = labels;
    chartD2C.data.labels = labels;

    chartD1.data.datasets.forEach(function (dataset, i) {
      if (i === 0) {
        dataset.data = chartD1LowerCI;
      } else if (i === 1) {
        dataset.data = chartD1UpperCI;
      } else {
        dataset.data = chartD1Data;
      }
    });

    chartD1.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        createTooltip(
          this,
          tooltip,
          barIndex,
          chartD1Data,
          chartD1UpperCI,
          chartD1LowerCI,
          '%'
        );
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartD1.update();

    chartD1B.data.datasets.forEach(function (dataset, i) {
      if (i == 0) {
        dataset.data = chartD1BLowerCI;
      } else if (i == 1) {
        dataset.data = chartD1BUpperCI;
      } else {
        dataset.data = chartD1BData;
      }
    });

    chartD1B.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        createTooltip(
          this,
          tooltip,
          barIndex,
          chartD1BData,
          chartD1BUpperCI,
          chartD1BLowerCI,
          '%'
        );
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartD1B.update();

    chartD1C.data.datasets.forEach(function (dataset, i) {
      if (i == 0) {
        dataset.data = chartD1CLowerCI;
      } else if (i == 1) {
        dataset.data = chartD1CUpperCI;
      } else {
        dataset.data = chartD1CData;
      }
    });

    chartD1C.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        createTooltip(
          this,
          tooltip,
          barIndex,
          chartD1CData,
          chartD1CUpperCI,
          chartD1CLowerCI,
          '%'
        );
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartD1C.update();

    chartD2.data.datasets.forEach(function (dataset, i) {
      if (i === 0) {
        dataset.data = chartD2LowerCI;
      } else if (i === 1) {
        dataset.data = chartD2UpperCI;
      } else {
        dataset.data = chartD2Data;
      }
    });

    chartD2.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        createTooltip(
          this,
          tooltip,
          barIndex,
          chartD2Data,
          chartD2UpperCI,
          chartD2LowerCI,
          '#'
        );
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartD2.update();

    chartD2B.data.datasets.forEach(function (dataset, i) {
      if (i === 0) {
        dataset.data = chartD2BLowerCI;
      } else if (i === 1) {
        dataset.data = chartD2BUpperCI;
      } else {
        dataset.data = chartD2BData;
      }
    });

    chartD2B.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        createTooltip(
          this,
          tooltip,
          barIndex,
          chartD2BData,
          chartD2BUpperCI,
          chartD2BLowerCI,
          '#'
        );
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartD2B.update();

    chartD2C.data.datasets.forEach(function (dataset, i) {
      if (i === 0) {
        dataset.data = chartD2CLowerCI;
      } else if (i === 1) {
        dataset.data = chartD2CUpperCI;
      } else {
        dataset.data = chartD2CData;
      }
    });

    chartD2C.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        createTooltip(
          this,
          tooltip,
          barIndex,
          chartD2CData,
          chartD2CUpperCI,
          chartD2CLowerCI,
          '#'
        );
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartD2C.update();

    chartD3.data.datasets.forEach(function (dataset, i) {
      if (i === 0) {
        dataset.data = chartD3LowerCI;
      } else if (i === 1) {
        dataset.data = chartD3UpperCI;
      } else {
        dataset.data = chartD3Data;
      }
    });

    chartD3.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        createTooltip(
          this,
          tooltip,
          barIndex,
          chartD3Data,
          chartD3UpperCI,
          chartD3LowerCI,
          '# '
        );
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartD3.update();

    chartD3B.data.datasets.forEach(function (dataset, i) {
      if (i === 0) {
        dataset.data = chartD3BLowerCI;
      } else if (i === 1) {
        dataset.data = chartD3BUpperCI;
      } else {
        dataset.data = chartD3BData;
      }
    });

    chartD3B.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        createTooltip(
          this,
          tooltip,
          barIndex,
          chartD3BData,
          chartD3BUpperCI,
          chartD3BLowerCI,
          '#'
        );
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartD3B.update();

    chartD3C.data.datasets.forEach(function (dataset, i) {
      if (i === 0) {
        dataset.data = chartD3CLowerCI;
      } else if (i === 1) {
        dataset.data = chartD3CUpperCI;
      } else {
        dataset.data = chartD3CData;
      }
    });

    chartD3C.options.tooltips.custom = function (tooltip) {
      if (tooltip.dataPoints) {
        var barIndex = tooltip.dataPoints[0].index;
        createTooltip(
          this,
          tooltip,
          barIndex,
          chartD3CData,
          chartD3CUpperCI,
          chartD3CLowerCI,
          '#'
        );
      } else {
        document.getElementById('chartjs-tooltip').remove();
      }
    };

    chartD3C.update();

    // find out which dataset is starts earlier and truncate the labels to this year
    var index1 = 0;
    var index2 = 0;

    chartCData1.forEach(function (num, i) {
      if (num === null) {
        index1 = i;
      }
    });

    chartCData2.forEach(function (num, i) {
      if (num === null) {
        index2 = i;
      }
    });

    if (index1 < index2) {
      var index = index1;
    } else {
      var index = index2;
    }

    chartC.data.labels = chartCLabels.slice(index, chartCLabels.length);

    chartCData1 = chartCData1.slice(index, chartCData1.length);
    chartCData2 = chartCData2.slice(index, chartCData2.length);

    var newCDataSets = [chartCData1, chartCData2];

    chartC.data.datasets.forEach(function (dataset, i) {
      dataset.data = newCDataSets[i];
    });

    chartC.update();
  }

  function updateChartE(surveyData, currentCode) {
    // CHART E

    var $chartEBody = $('#chartETable tbody').html(''),
      html,
      numArticles = 0;
    surveyData.forEach(function (survey) {
      if (survey.ISO3 === currentCode) {
        html = `<tr>
            <td><div>${survey['Level']}</td></div>
            <td><div>${survey['Author, Date']}</td></div>
            <td><div>${survey['Year start']} &ndash; ${survey['Year end']}</td></div>
            <td><div>${survey['Agestart']} &ndash; ${survey['Ageend']}</td></div>
            <td><div>${survey['pHBsAg']}</td></div>
            <td><div>${survey['Low_CI']}</td></div>
            <td><div>${survey['High_CI']}</td></div>
            <td><div>${survey['Country']}</td></div>
            <td><div>${survey['ISO3']}</td></div>
            <td><div>${survey['Region']}</td></div>
            <td><div>${survey['IIA']}</td></div>`;

        if (survey.hyperlink) {
          html += `<td><div><a target='_blank' href='${survey.hyperlink}'>link</a></div></td>`;
        } else {
          html += '<td><div>link pending</div></td>';
        }

        html += '</tr>';

        $chartEBody.append(html);
        numArticles++;
      }
    });

    if (numArticles === 0) {
      $('#no-studies').show();
    } else {
      $('#no-studies').hide();

      $('#chartETable').DataTable({
        scrollY: '200px',
        scrollCollapse: false,
        paging: false,
        searching: false,
        retrieve: true,
      });
    }
  }

  function createTooltip(cntx, tooltip, index, d, dhighci, dlowci, valueLabel) {
    var title = tooltip.title,
      value = d[index].toLocaleString(),
      hiCi = dhighci[index].toLocaleString(),
      lowCi = dlowci[index].toLocaleString();

    var titleMap = {
      'PreVer1-vac': 'PreVer1-vaccination',
      '2015 est.': '2015 estimate',
      'Under 5 yrs': 'Under 5 years',
      'General pop': 'All Ages',
    };

    // Tooltip Element
    var tooltipEl = document.getElementById('chartjs-tooltip');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      // tooltipEl.innerHTML = "<table class='ui celled table'></table>";
      tooltipEl.innerHTML = "<div id='popup-content'></div>";
      cntx._chart.canvas.parentNode.appendChild(tooltipEl);
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }

    if (valueLabel != '%') {
      valueLabel = '';
    }

    var innerHtml = `<span class='ui tiny header'>Estimated: ${value}${valueLabel}</span><br>
      <span class='ui tiny header'>Upper 95% CI:  ${hiCi}${valueLabel}</span><br>
      <span class='ui tiny header'>Lower 95% CI: ${lowCi}${valueLabel}</span><br>`;

    $('#popup-content').html(innerHtml);

    var positionY = cntx._chart.canvas.offsetTop;
    var positionX = cntx._chart.canvas.offsetLeft;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.fontFamily = tooltip._fontFamily;
    tooltipEl.style.fontSize = tooltip.fontSize;
    tooltipEl.style.fontStyle = tooltip._fontStyle;
    tooltipEl.style.padding =
      tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
  }

  function makeMap(data, countries, regionAndIncomeMap, isoCodes) {
    var currentVariable = 'PreVer1U5EstPer';

    var colors = ['#f6d2a9', '#f19c7c', '#dd686c', '#b13f64'];

    $('#legend1').css('background', colors[3]);
    $('#legend2').css('background', colors[2]);
    $('#legend3').css('background', colors[1]);
    $('#legend4').css('background', colors[0]);
    $('#legend5').css('background', '#979797');

    data.forEach(function (datum) {
      var dataIso = datum.ISO3;

      countries.objects.countries.geometries.forEach(function (country) {
        var iso = country.properties.ISO_3_CODE;

        if (dataIso === iso) {
          country.properties.data = datum;
        }
      });
    });

    var width = d3.select('#map').style('width').slice(0, -2);
    var height = d3.select('#map').style('height').slice(0, -2);

    var svg = d3
      .select('#map svg')
      .attr('width', width - 5)
      .attr('height', height - 5)
      .attr('id', 'map-svg');

    var projection = d3.geoEckert3().scale(8).translate([0, 0]).precision(0.1);

    var path = d3.geoPath().projection(projection);

    var zoom = d3.zoom().scaleExtent([10, 200]).on('zoom', zoomed);

    var center = projection([-30, 20]);

    var info = $('#map-hover-output');

    var countrySvgs = svg
      .selectAll('path')
      .data(
        topojson
          .feature(countries, countries.objects.countries)
          .features.filter(function (d) {
            if (d.properties.iso != 'ATA') {
              return d;
            }
          })
      )
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .on('mouseover', function (d) {
        try {
          var currentCode = d.properties.data.ISO3;
          for (var code in isoCodes) {
            if (currentCode === isoCodes[code]) {
              var iso2Code = code;
            }
          }
          countrySvgs.style('opacity', '.7');
          d3.select(this).style('opacity', '1');
          d3.select('#map-hover-country').html(
            "<i class='" +
              iso2Code.toLowerCase() +
              " flag'></i>" +
              d.properties.data.Country
          );
          d3.select('#map-hover-under-Per').html(
            d.properties.data['PreVer1U5EstPer'] + '%'
          );
          d3.select('#map-hover-under-2015').html(
            d.properties.data['PostVer1U5EstPer'] + '%'
          );
          d3.select('#map-hover-general-Per').html(
            d.properties.data['PreVer1GPEstPer'] + '%'
          );
          d3.select('#map-hover-general-2015').html(
            d.properties.data['PostVer1GPEstPer'] + '%'
          );
          d3.select('#map-hover-u5-prevented').html(
            (d.properties.data['NumCarPreventVer1U5'] * 1000).toLocaleString()
          );
          d3.select('#map-hover-gp-prevented').html(
            (d.properties.data['NumCarPreventVer1GP'] * 1000).toLocaleString()
          );
          console.log(d.properties.data);
          info.show();
        } catch (e) {
          // shhhhhh ...
        }
      })
      .on('mouseout', function () {
        info.hide();
        countrySvgs.style('opacity', '1');
      })
      .on('click', function (d) {
        var currentCode = d.properties.data.ISO3;
        for (var code in isoCodes) {
          if (currentCode === isoCodes[code]) {
            var iso2Code = code;
          }
        }

        $('#dropdown-current-country').html(
          "<i class='" +
            iso2Code.toLowerCase() +
            " flag'></i>" +
            d.properties.data.Country
        );
        $('.current-country').html(
          "<i class='" +
            iso2Code.toLowerCase() +
            " flag'></i>" +
            d.properties.data.Country
        );
        $('.regional-group').html(regionAndIncomeMap[currentCode].region);

        if (currentEstYear == '2015') {
          $('.income-group').html(regionAndIncomeMap[currentCode].income2017);
        } else {
          $('.income-group').html(regionAndIncomeMap[currentCode].income2020);
        }
      });

    var maskLines = svg.append('g');

    maskLines
      .selectAll('path')
      .data(
        topojson.feature(countries, countries.objects.maskline_general_2013)
          .features
      )
      .enter()
      .append('path')
      .attr('class', 'lines')
      .attr('d', path);

    // when the mouse moves on the document
    $(document).mousemove(function (e) {
      // first offset from the mouse position of the info window
      info.css({
        left: e.pageX + 6,
        top: e.pageY - info.height() - 25,
      });

      // if it crashes into the top, flip it lower right
      if (info.offset().top < 4) {
        info.css({
          top: e.pageY + 15,
        });
      }
      // if it crashes into the right, flip it to the left
      if (info.offset().left + info.width() >= $(document).width() - 40) {
        info.css({
          left: e.pageX - info.width() - 80,
        });
      }
    });

    svg.call(zoom).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(19.5)
        .translate(-center[0] - 3, -center[1] - 2)
    );

    function zoomed() {
      var transform = d3.event.transform;

      countrySvgs
        .attr('transform', transform)
        .style('stroke-width', 1 / transform.k);

      maskLines
        .attr('transform', transform)
        .style('stroke-width', 1 / transform.k);
    }

    updateMap(countrySvgs, data, currentVariable);

    $('.checkbox').checkbox({
      onChecked: function () {
        currentVariable = $(this).attr('data-value');
        updateMap(countrySvgs, data, currentVariable);
      },
    });
  }

  function updateMap(countries, data, variable) {
    var colors = ['#f6d2a9', '#f19c7c', '#dd686c', '#b13f64'];

    var breaks = [2, 5, 8];

    var color = d3.scaleThreshold().domain(breaks).range(colors);

    countries.attr('fill', function (d) {
      try {
        return color(d.properties.data[variable]);
      } catch (e) {
        return '#979797';
      }
    });
  }
})(Chart, $, d3);
