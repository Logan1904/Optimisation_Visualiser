// Margin convention
var margin = {top: 20, bottom: 20,right: 25, left: 25};

// Screen variables
var width = document.getElementById('contour').clientWidth - margin.right - margin.left;        // Width is always size of the 10 columns
var height = 0.8*document.getElementById('contour').clientWidth - margin.top - margin.bottom;   // Height is always 0.8*Width

// Create SVG and append
var svg = d3.select("#contour")
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .style("display", "block")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Grid sizes
var nx = Math.floor(width / 5);
var ny = Math.floor(height / 5);

// Scales
var scale_x = d3.scaleLinear()
                .domain([0, width])
                .range(domain_x);

var scale_y = d3.scaleLinear()
                .domain([0, height])
                .range(domain_y);

var thresholds = d3.range(domain_f[0], domain_f[1], contour_step);

var color_scale = d3.scaleLinear()
                    .domain(d3.extent(thresholds))
                    .interpolate(function() { return d3.interpolateMagma; });

// Contour plot
var contours = d3.contours()
                 .size([nx, ny])
                 .thresholds(thresholds);

// Get objective function values at every grid point
var f_values = new Array(nx*ny);
for (let i = 0; i < nx; ++i) {
    for (let j = 0; j < ny; ++j) {
        var x = scale_x(i/nx*width);
        var y = scale_y(j/ny*height);

        f_values[i + nx*j] = f(x,y);
    }
}

// Add contour plot to SVG
svg.append("g")
   .attr("fill", "none")
   .attr("stroke", "#fff")
   .attr("stroke-opacity", "0.5")
   .selectAll("path")
   .data(contours(f_values))
   .enter().append("path")
   .attr("d", d3.geoPath(d3.geoIdentity().scale(width / nx)))
   .attr("fill", function(d) { return color_scale(d.value); })
   .on('click', contour_click);

// Add axes to SVG
var bottomAxis = d3.axisBottom(d3.scaleLinear().domain(domain_x).range([0,width]));
var leftAxis = d3.axisLeft(d3.scaleLinear().domain(domain_y).range([height,0]));

svg.append("g").call(bottomAxis).attr("transform", "translate(0," + height + ")");
svg.append("g").call(leftAxis);

// Add grid to SVG
svg.append("g").call(bottomAxis.tickSize(height).tickFormat("")).style("stroke-dasharray", "5 5").attr("class", "grid");
svg.append("g").call(leftAxis.tickSize(-width).tickFormat("")).style("stroke-dasharray", "5 5").attr("class", "grid");

// Create menu SVG
var menu_width = document.getElementById('menu').clientWidth - margin.right - margin.left;        // Width is always size of the 10 columns
var menu_height = height;   // Height is always 0.8*Width

var menu_svg = d3.select("#menu")
            .append("svg")
            .attr("width", menu_width + margin.right + margin.left)
            .attr("height", menu_height + margin.top + margin.bottom)
            .style("display", "block")
            .style("margin", "auto")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add menu            
menu_svg.append("g").append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", menu_width)
                    .attr("height", menu_height)
                    .attr("fill", "white")
                    .attr("opacity", 0);

// Add menu buttons                
colors = {}
for (var i = 0; i < buttons.length; ++i) {
    colors[buttons[i]] = d3.schemeTableau10[i];
}
var button_length = menu_width*0.8;
var button_height = 30;

menu_svg.selectAll("buttons")
        .data(buttons)
        .enter()
        .append("rect")
        .attr("x", menu_width*0.1)
        .attr("y", function(d,i) {return (menu_height / (buttons.length+1) * (i+1)) - (button_height/2);})
        .attr("width", menu_width*0.8)
        .attr("height", 30)
        .attr("fill", d => colors[d])
        .attr("stroke", "black")
        .attr("class", function(d) {return d;})
        .on('click', click)

// Add menu text
menu_svg.selectAll("text")
        .data(buttons)
        .enter()
        .append("text")
        .attr("x", menu_width*0.5)
        .attr("y", function(d,i) {return (menu_height / (buttons.length+1) * (i+1));})
        .text(function(d) {return d;})
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-family", "Arial")
        .attr("font-size", 15)
        .attr("font-weight", "bold")
        .attr("fill", "white");

// Click function
var draw = {};
for (var i = 0; i < buttons.length; ++i) {
    draw[buttons[i]] = true;
}

function click() {
    var button = d3.select(this);
    if (draw[button.attr("class")]) {       // If button is already enabled, disable it
        button.attr("opacity", 0.5);
        draw[button.attr("class")] = false;
    } else {
        button.attr("opacity", 1);
        draw[button.attr("class")] = true;
    }
}

// Draw path
var optimisation_path = svg.append("g");
var defs = svg.append("defs")
var line = d3.line().x(d => scale_x.invert(d.x))
                    .y(d => scale_y.invert(d.y));

function draw_path(data, type) {
    defs.append("marker")
    .attr("id", "circle")
    .attr("markerWidth", 10)
    .attr("markerHeight",10)
    .attr("refX", "5")
    .attr("refY", "5")
    .append("circle")
        .attr("cx", 5)
        .attr("cy", 5)
        .attr("r", 2)
        .attr("stroke", "white")
        .attr("fill", colors[type])

    optimisation_path.selectAll(type)
                     .data(data)
                     .enter()
                     .append("path")
                     .attr("d", line(data.slice(0,1)))
                     .attr("stroke", colors[type])
                     .attr("stroke-width", 3)
                     .attr("fill", "none")
                     .transition()
                     .duration(30)
                     .delay(function(d,i) { return 30 * i; })
                     .attr("d", function(d,i) { return line(data.slice(0,i+1));})
                     .attr("marker-end", "url(#circle)");

                         

}

function contour_click() {
    var me = d3.mouse(this);
    minimize(scale_x(me[0]), scale_y(me[1]));
}
