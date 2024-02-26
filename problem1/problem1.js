// Problem 1

var sum_to_n_a = function(n) {
    var sum = 0;
    for (var i=0 ; i<=n ; i++){
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function(n) {
    var sum = (n/2) * (n+1);
    return sum;
};

var sum_to_n_c = function(n) {
    if (n == 1){
        return 1;
    } else {
        return (sum_to_n_c(n-1) + n);
    }
};

// console.log("sum_to_n_a on input 5:", sum_to_n_a(5)); 
// console.log("sum_to_b_a on input 5:", sum_to_n_b(5)); 
// console.log("sum_to_c_a on input 5:", sum_to_n_c(5)); 
