# Belly Button Biodiversity

Visit Belly Button Biodiversity Website >> [Click Here!](https://abpuccini.github.io/plotly-challenge/)

## Background

To construct an interactive dashboard to explore the Belly Button Biodiversity dataset, which catalogs the microbes that colonize human navels.

Dataset: [Belly Button Biodiversity Dataset](data/samples.json)

Source: [NC State The Public Science Lab](http://robdunnlab.com/projects/belly-button-biodiversity/)

## Dashboard Blueprint

### Selection and Data Retriever

    ```java
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
    ```

### Bar Chart



### Gauge Chart



### Bubble Chart



### Research Context



## References

> Dumke, K. (2013, May 15). Belly Button Biodiversity. Retrieved December 17, 2020, from https://www.nationalgeographic.org/article/belly-button-biodiversity/

> Experts, K. (Ed.). (n.d.). Why Do I Have a Belly Button? (for Kids) - Nemours KidsHealth. Retrieved December 17, 2020, from https://kidshealth.org/en/kids/navel.html

> Shipman, M. (2012, November 07). Navel-Gazing Researchers ID Which Species Live in Our Belly Buttons (But Don't Know Why). Retrieved December 17, 2020, from https://news.ncsu.edu/2012/11/wms-belly-button-biodiversity/

---
© [Atcharaporn B Puccini](https://www.linkedin.com/in/abpuccini)