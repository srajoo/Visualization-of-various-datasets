var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.timeParse("%Y");

// Set the ranges
var x = d3.scaleTime().range([0, width]);  
var y = d3.scaleLinear().range([height, 0]);

// Define the line
var priceline = d3.line()	
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.GDP); });
    
// Adds the svg canvas
var svg = d3.select("#line2")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/gdp-per-capita.csv").then(function(data) {

  data.forEach(function(d) {
		d.Year = parseDate(d.Year);
		d.GDP = +d.GDP;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.Year; }));
    y.domain([0, d3.max(data, function(d) { return d.GDP; })]);

    // Group the entries by symbol
    dataNest = Array.from(
	    d3.group(data, d => d.Country), ([key, value]) => ({key, value})
	  );
  
    // set the colour scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 

        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .attr("d", priceline(d.value));

        // Add the Legend
        svg.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
            .attr("y", height + (margin.bottom/2)+ 30)
            .attr("class", "legend")    // style the legend
            .style("fill", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .text(d.key); 
        
        svg.append('text')
                .attr('y',height + (margin.bottom/2)+ 5 )
                .attr('x', width/2)
                .text('Year')
    });

  // Add the X Axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
      .tickFormat(d3.format('.2s'));

});
