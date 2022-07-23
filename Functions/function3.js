// Rosenbrock Function
function f(x, y) {
    var a = 1;
    var b = 2;
    return (a-x)**2 + b*(y-x**2)**2;
  }

// Gradient
function grad_f(x, y) {
    var a = 1;
    var b = 2;
    return [-2*(a-x) - 4*b*x*(y-x**2), 2*b*(y-x**2)];
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

// Define buttons
var buttons = ["Gradient"];

// Step size of contour plot
var contour_step = 0.5;

// Minimise function
function minimize(x0, y0) {
    // Remove paths
    optimisation_path.selectAll("path").remove();
    // Remove arrows
    defs.selectAll("marker").remove();

    if (draw["Gradient"]) {
        var his = gradient_descent(x0, y0, 3e-2, 100, 0.001);
        draw_path(his, "Gradient");
    }

}
// Domain Size
var domain_x = [-2, 2];
var domain_y = [-1, 3];
var domain_f = [0, 20];