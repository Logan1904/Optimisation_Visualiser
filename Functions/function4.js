// Beale Function
function f(x, y) {
    return (1.5-x+x*y)**2 + (2.25-x+x*y**2)**2 + (2.625-x+x*y**3)**2;
}

// Gradient
function grad_f(x, y) {
    return [2*((1.5-x+x*y)*(-1+y) + (2.25-x+x*y**2)*(-1+y**2) + (2.625-x+x*y**3)*(-1+y**3)), 
            2*((1.5-x+x*y)*(x) + (2.25-x+x*y**2)*(2*x*y) + (2.625-x+x*y**3)*(3*x*y**2))];
}

// Gradient Descent Algorithm
function gradient_descent(x0, y0, alpha, max_iter, tol=0.01) {
    var history = [{"x": x0, "y": y0}];

    var x = x0;
    var y = y0;

    for (var i = 0; i < max_iter; ++i) {
        var diff = grad_f(x,y).map(x => x*alpha);

        if (Math.abs(diff[0]) < tol && Math.abs(diff[1]) < tol) {
            break;
        }

        x -= diff[0];
        y -= diff[1];

        if (isNaN(x) || isNaN(y)) {
            console.log("DIVERGENCE");
            break;
        }

        history.push({"x": x, "y": y});
    }

    return history;
}

// Define buttons
var buttons = ["Gradient"];

// Step size of contour plot
var contour_step = 100;

// Minimise function
function minimize(x0, y0) {
    // Remove paths
    optimisation_path.selectAll("path").remove();
    // Remove arrows
    defs.selectAll("marker").remove();


    if (draw["Gradient"]) {
        var his = gradient_descent(x0, y0, 0.001, 100, 0.0001);
        draw_path(his, "Gradient");
    }

}

// Domain Size
var domain_x = [-4.5, 4.5];
var domain_y = [-3.6, 3.6];
var domain_f = [-10, 5000];

var thresholds = d3.range(domain_f[0], domain_f[1]).map(i => Math.pow(2, i));

var color_scale = d3.scaleLog()
                    .range(d3.extent(thresholds))
                    .domain([1, domain_f[1]])
                    .interpolate(function() { return d3.interpolateMagma; });