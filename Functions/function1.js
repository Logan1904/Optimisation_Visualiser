// Sphere Function
function f(x, y) {
    return x**2 + y**2;
}

// Gradient
function grad_f(x, y) {
    return [2*x, 2*y];
}

// Second derivative
function grad2_f(x, y) {
    return [2, 2];
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

        history.push({"x": x, "y": y});
    }

    return history;
}

// Newtons Method
function newtons_method(x0, y0, max_iter, tol=0.01) {
    var history = [{"x": x0, "y": y0}];

    var x = x0;
    var y = y0;

    for (var i = 0; i < max_iter; ++i) {
        var g1 = grad_f(x,y);
        var g2 = grad2_f(x,y);

        var diff = g1.map(function(d,i) {return d / g2[i];})
        if (Math.abs(diff[0]) < tol && Math.abs(diff[1]) < tol) {
            break;
        }

        x -= diff[0];
        y -= diff[1];

        history.push({"x": x, "y": y});
    }

    return history;
}

// Define buttons
var buttons = ["Gradient", "Newton"];

// Step size of contour plot
var contour_step = 5;

// Minimise function
function minimize(x0, y0) {
    // Remove paths
    optimisation_path.selectAll("path").remove();
    // Remove arrows
    defs.selectAll("marker").remove();


    if (draw["Gradient"]) {
        var his = gradient_descent(x0, y0, 0.01, 100);
        draw_path(his, "Gradient");
    }

    if (draw["Newton"]) {
        var his = newtons_method(x0, y0, 100);
        draw_path(his, "Newton");
    }

}

// Domain Size
var domain_x = [-10, 10];
var domain_y = [-8, 8];
var domain_f = [0, 100];

var thresholds = d3.range(domain_f[0], domain_f[1], contour_step);

var color_scale = d3.scaleLinear()
                    .domain(d3.extent(thresholds))
                    .interpolate(function() { return d3.interpolateMagma; });