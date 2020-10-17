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

// define date variables
var startDay;
var endDay;

// create calendar
var freeDate = moment("2018-03-17");

$('input[name="daterange"]').daterangepicker({
  opens: 'left',
  maxDate: freeDate,
  ranges: {
    'Last 7 Days': [freeDate.clone().subtract(6,'days'), freeDate],
    'Last 30 Days': [freeDate.clone().subtract(29,'days'), freeDate],
    'Last Year': [freeDate.clone().subtract(1,'year'), freeDate],
    'Last 5 Years': [freeDate.clone().subtract(5,'year'), freeDate]
  }}, 
  function(start, end) {
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'))
    startDay = start.clone();
    endDay = end.clone();
  });


// Create button function
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input value from the form
  var stock = d3.select("#stockInput").node().value;
  console.log(stock);
 
  // console.log(startDay);
  // console.log(endDay);
 
  //  Build the plot with the new stock
  buildPlot(stock, startDay.format('YYYY-MM-DD'), endDay.format('YYYY-MM-DD'));
}

function buildPlot(stock, startDate, endDate) {

  var apiKey = API_KEY; // Either puth api key from quandl here or in config.js as const API_KEY 

  var url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

  d3.json(url).then(function(data) {
    console.log(data.dataset);

    // Grab values from the response json object to build the plots
    var name = data.dataset.name;
    var stock = data.dataset.dataset_code;
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    var dates = unpack(data.dataset.data, 0);
    var openingPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      line: {
        color: "#17BECF"
      }
    };

    // Candlestick Trace
    var trace2 = {
      type: "candlestick",
      x: dates,
      high: highPrices,
      low: lowPrices,
      open: openingPrices,
      close: closingPrices
    };

    var data = [trace2];

    var layout = {
      title: `${stock} Daily Stock Value`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear",
        title: {text: "Stock Price ($)"}
      }
    };

    Plotly.newPlot("plot", data, layout);
  });
}

// function to call to get new start and end days from calendar
function getDates() {
  startDay = $('#daterange').data('daterangedata').startDate;
  endDay = $('#daterange').data('daterangedata').endDate;
  console.log(startDay);
  
}

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);
// Event listener for daterange input
d3.select("#daterange").on('change', getDates);



