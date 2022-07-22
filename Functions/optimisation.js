// Margin convention
var margin = {top: 20, bottom: 20,right: 20, left: 20};

// Screen variables
var width = document.getElementById('contour').clientWidth - margin.right - margin.left;        // Width is always size of the 10 columns
var height = 0.8*document.getElementById('contour').clientWidth - margin.top - margin.bottom;   // Height is always 0.8*Width

// Create SVG and append
var svg = d3.select("#contour")
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .style("display", "block")
            .style("margin", "auto")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Grid sizes
var nx = Math.floor(width / 5);
var ny = Math.floor(height / 5);

// Step size of contour plot
var contour_step = 5;

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
   .attr("fill", function(d) { return color_scale(d.value); });

// Add axes to SVG
var bottomAxis = d3.axisBottom(d3.scaleLinear().domain(domain_x).range([0,width]));
var leftAxis = d3.axisLeft(d3.scaleLinear().domain(domain_y).range([0,height]));

svg.append("g").call(bottomAxis).attr("transform", "translate(0," + height + ")");
svg.append("g").call(leftAxis);

// Add grid to SVG
svg.append("g").call(bottomAxis.tickSize(height).tickFormat("")).style("stroke-dasharray", "5 5").attr("class", "grid");
svg.append("g").call(leftAxis.tickSize(-width).tickFormat("")).style("stroke-dasharray", "5 5").attr("class", "grid");

// Add menu
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

menu_svg.append("g").append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", menu_width)
                    .attr("height", menu_height)
                    .attr("fill", "black");


// Gradient Descent Algorithm
function gradient_descent(x0, y0, alpha, max_iter, tol=0.01) {
    var history = [{"x": x0, "y": y0}];

    var x = x0;
    var y = y0;

    for (let i = 0; i < max_iter; ++i) {
        diff = grad_f(x,y).map(x => x*alpha);

        if (diff[0] < tol && diff[1] < tol) {
            break;
        }

        x -= diff[0];
        y -= diff[1];

        history.push({"x": x, "y": y});

        console.log(i);
    }

    return history
}