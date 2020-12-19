// Plot.ly Homework - Belly Button Biodiversity

// Initialize arrays to hold data
var ids = [];
var metadata = [];
var samples = [];

// Function to call data when the webpage loads
function init() {
    // Append options for users to select based on ids
    d3.json("data/samples.json").then(function (data) {

        // Retrieve data and store it into variables
        ids = data.names;
        metadata = data.metadata;
        samples = data.samples;

        // Append the options for users to select
        var selection = d3.select("#selDataset");
        ids.forEach(element => {
            var options = selection.append("option");
            options.property("value", element);
            options.text(element);
        });

        // Call the visualization when the webpage first loads
        optionChanged(selection.property("value"));
    });
}

// Call init() function to render the page
init();

// Source: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
// Make all letters to uppercase
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Source: https://stackoverflow.com/questions/23095637/how-do-you-get-random-rgb-in-javascript
// Random color
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
}

// Define function to call all visualizations
function optionChanged(id) {
    barPlot(id);
    bubbleChart(id);
    demoGraphic(id);
    gaugeChart(id);
};

// Function for bar plot
function barPlot(id) {

    // Filter data when user select test subject ID
    var filteredData = samples.filter(event => parseInt(event.id) === parseInt(id));

    // filteredData is a dictionary, to get an array, the index needed to pass in
    var test_data = filteredData[0];

    // Get sample_values, otu_ids, otu_labels
    var sample_values = test_data.sample_values.slice(0, 10).reverse();
    var otu_ids = test_data.otu_ids.slice(0, 10).reverse();
    var otu_labels = test_data.otu_labels.slice(0, 10).reverse();

    // Trace for the bar chart
    var trace = {
        x: sample_values,
        y: otu_ids.map(id => `OTU ${id}`),
        text: otu_labels,
        type: "bar",
        orientation: "h",
        marker: {
            color: 'salmon'
        }
    };

    // data
    var data = [trace];

    // Apply the group bar mode to the layout
    var layout = {
        title: `<b>Top 10 OTUs Found in an Individual</b><br>(Test ID:${id})`,
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        },
        yaxis: {
            title: "<b>ID</b>"
        },
        xaxis: {
            title: "<b>Number of Samples</b>"
        }
    };

    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", data, layout);
};


// Function for demographic info
function demoGraphic(id) {

    // Filter data when user select test subject ID
    var filteredData = metadata.filter(event => parseInt(event.id) === parseInt(id));

    // filteredData is a dictionary, to get an array, the index needed to pass in
    var test_data = filteredData[0];

    // Select demo info box
    var demo_box = d3.select('#sample-metadata');

    // Modify the text of an HTML element
    var demoDefault = demo_box.selectAll("p");
    demoDefault.html("");

    // Get data by using key and value
    Object.entries(test_data).forEach(([key, value]) => {
        if (key === 'id') {
            var keys = key.toUpperCase();
        } else {
            var keys = capitalizeFirstLetter(key);
        }
        var info = demo_box.append("p")
        info.text(`${keys}` + ": " + `${value}`);
    });
}

function bubbleChart(id) {

    // Filter data when user select test subject ID
    var filteredData = samples.filter(event => parseInt(event.id) === parseInt(id));

    // filteredData is a dictionary, to get an array, the index needed to pass in
    var test_data = filteredData[0];

    // Get sample_values, otu_ids, otu_labels
    var sample_values = test_data.sample_values;
    var otu_ids = test_data.otu_ids;
    var otu_labels = test_data.otu_labels;

    // Get random color
    var colors = [];
    for (var i = 0; i < otu_ids.length; i++) {
        var color = random_rgba();
        colors.push(color);
    };

    // trace for bubble chart
    var trace = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: colors,
            opacity: otu_ids.map(id => 0.7)
        },
        type: 'scatter',
        text: otu_labels
    };

    // data
    var data = [trace];

    // Apply parameter to the layout
    var layout = {
        title: `<b>OTUs Found in an Individual</b><br>(Test ID:${id})`,
        showlegend: false,
        xaxis: {
            title: "<b>OTU ID</b>"
        },
        yaxis: {
            title: "<b>Number of Samples</b>"
        }
    };
    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot('bubble', data, layout);
}


function gaugeChart(value) {
    var filteredData = metadata.filter(event => parseInt(event.id) === parseInt(value))[0];
    var wfreq = filteredData.wfreq;
    var test_id = filteredData.id;

    // Source: https://codepen.io/ascotto/pen/eGNaqe?editors=0010
    // Trig to calc meter point
    function gaugePointer(value) {

        var degrees = 180 - (value * 20),
            radius = .6;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path:
        var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX, space, pathY, pathEnd);
        return path;
    }

    var data = [
        // Point at the bottom of the needle
        {
            value: wfreq,
            type: 'scatter',
            x: [0], y: [0],
            marker: { size: 5, color: '850000' },
            showlegend: false,
            name: `Test-ID ${test_id}`,
            text: `${wfreq} Times`,
            hoverinfo: 'name+text'
        },
        // Gauge chart
        {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6',
                '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            textinfo: 'text',
            textposition: 'inside',
            marker: {
                colors: ['rgba(0, 25, 0, .5)', 'rgba(5, 50, 22, .5)',
                    'rgba(10, 90, 42, .5)', 'rgba(14, 127, 0, .5)',
                    'rgba(110, 154, 22, .5)', 'rgba(170, 202, 42, .5)',
                    'rgba(202, 209, 95, .5)', 'rgba(210, 206, 145, .5)',
                    'rgba(232, 226, 202, .5)', 'rgba(255, 255, 255, 0)']
            },
            labels: ['8-9', '7-8', '6-7', '5-6',
                '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
        }];

    // Apply parameter to the layout
    var layout = {
        // Needle
        shapes: [{
            type: 'path',
            path: gaugePointer(wfreq),
            fillcolor: '850000',
            line: {
                color: '850000'
            }
        }],
        // Visualization
        margin: { t: 100, b: 0 },
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
        autosize: true,
        xaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        },
        yaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        }
    };
    // Render the plot to the div tag with id "gauge"
    Plotly.newPlot('gauge', data, layout);
};

