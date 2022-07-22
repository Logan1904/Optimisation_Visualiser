// Sphere Function
function f(x, y) {
    return x**2 + y**2;
  }

// Gradient
function grad_f(x, y) {
    return [2*x, 2*y];
}

// Domain Size
var domain_x = [-10, 10];
var domain_y = [-8, 8];
var domain_f = [0, 100];