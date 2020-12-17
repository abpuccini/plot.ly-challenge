// Plot.ly Homework - Belly Button Biodiversity

// Initialize arrays to hold data
var ids = [];
var metadata = [];
var samples = [];

// Append options for users to select based on ids
d3.json("data/samples.json").then(function (data) {
    ids = data.names;
    metadata = data.metadata;
    samples = data.samples;
    var selection = d3.select("#selDataset");
    ids.forEach(element => {
        var options = selection.append("option");
        options.property("value", element);
        options.text(element);
    });
    optionChanged(selection.property("value"));
});

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
        title: "<b>Top 10 OTUs Found in an Individual</b>",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };

    // Render the plot to the div tag with id "plot"
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
        info.text(`${keys}: ${value}`);
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

    console.log(color);

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

    // Apply the group bar mode to the layout
    var layout = {
        title: "<b>OTUs Found in an Individual</b>",
        showlegend: false
    };

    Plotly.newPlot('bubble', data, layout);
}

function gaugeChart(value) {
    var filteredData = metadata.filter(event => parseInt(event.id) === parseInt(value))[0];
    var wfreq = filteredData.wfreq;
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            type: "indicator",
            mode: "gauge+number",
            text: ['0-1', '1-2', '2-3', '3-4',
                '4-5', '5-6', '6-7', '7-8', '8-9'],
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 1], color: "#f0f5e6" },
                    { range: [1, 2], color: "#e0ebcc" },
                    { range: [2, 3], color: "#c9dba6" },
                    { range: [3, 4], color: "#bad18c" },
                    { range: [4, 5], color: "#80b280" },
                    { range: [5, 6], color: "#66a366" },
                    { range: [6, 7], color: "#597a59" },
                    { range: [7, 8], color: "gray" },
                    { range: [8, 9], color: "gray" },
                ],

            }
        }
    ];

    var layout = {

        margin: { t: 100, b: 0 },
        title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
        autosize: true,
    };
    Plotly.newPlot('gauge', data, layout);
};