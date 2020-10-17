var apiKey = API_KEY;

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
}

function getMonthlyData() {
    var queryUrl = `https://www.quandl.com/api/v3/datasets/USMISERY/INDEX.json?api_key=${apiKey}`;
    d3.json(queryUrl).then(function(data) {
      var dates = unpack(data.dataset.data, 0);
      var unemploymentRate = unpack(data.dataset.data, 1);
      var inflationRate = unpack(data.dataset.data, 2);
      var miseryIndex = unpack(data.dataset.data, 3);
      buildTable(dates, unemploymentRate, inflationRate, miseryIndex);
    });

}

function buildTable(dates, unemploymentRate, inflationRate, miseryIndex) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < 12; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(unemploymentRate[i]);
    trow.append("td").text(inflationRate[i]);
    trow.append("td").text(miseryIndex[i]);    
  }
}

function buildPlot() {
  var url = `https://www.quandl.com/api/v3/datasets/USMISERY/INDEX.json?api_key=${apiKey}`;

  d3.json(url).then(function(data) {

    // Grab values from the response json object to build the plots
    
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    var dates = unpack(data.dataset.data, 0);
    var unemploymentRate = unpack(data.dataset.data, 1);
    var inflationRate = unpack(data.dataset.data, 2);
    var miseryIndex = unpack(data.dataset.data, 3);

    getMonthlyData();

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: "Unemployment Rate",
      x: dates,
      y: unemploymentRate,
      line: {
        color: "#17BECF"
      }
    };

    // Inflation Trace
    var trace2 = {
      type: "scatter",
      mode: "lines",
      name: "Inflation Rate",
      x: dates,
      y: inflationRate,
      line: {
        color: "#d62728"
      }
    };

    // Misery Trace
    var trace3 = {
      type: "scatter",
      mode: "lines",
      name: "Misery Index",
      x: dates,
      y: miseryIndex,
      line: {
        color: "#8c564bF"
      }
    };

    var data = [trace1, trace2, trace3];

    var layout = {
      title: `US Misery Index Since 1948`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };

    Plotly.newPlot("plot", data, layout);

  });
}

buildPlot();
