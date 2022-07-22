// Rastrigin Function
function f(x, y) {
    return 20 + (x**2 - 10*Math.cos(2*Math.PI*x)) + (y**2- 10*Math.cos(2*Math.PI*y));
  }
  
// Domain Size
var domain_x = [-5.12, 5.12];
var domain_y = [-4.096, 4.096];
var domain_f = [0, 100];