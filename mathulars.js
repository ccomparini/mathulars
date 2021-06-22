
var mathulars = function() {

    function mathulate(el, prob) {
        el.textContent = prob + ' = __________';
    }
    
    function operands(how_many, min, range) {
        var ops = new Array();
        for(var ind = 0; ind < how_many; ind++) {
            ops[ind] = min + Math.floor(Math.random() * (range-min));
        }
        return ops;
    }

    // these are pseudo-methods of Mathulator:
    var mathulators = {
        "addition": function(el) {
            mathulate(el, operands(2, 1, 1000).join(' + '));
        },
        "subtraction": function(el) {
            var ops = operands(2, 1, 1000);
            if(ops[0] < ops[1]) {
                // keep it positive:
                var tmp = ops[0];
                ops[0] = ops[1];
                ops[1] = tmp;
            }
            mathulate(el, ops.join(' - '));
        },
        "multiplication": function(el) {
            mathulate(el, operands(2, 2, 12).join(' x '));
        },
        "division": function(el) {
            var ops = operands(2, 2, 12);
            ops[0] = ops[0] * ops[1];
            mathulate(el, ops.join(' ÷ '));
        },
        "addition and subtraction": function(el) {
            if(Math.random() < 0.5) {
                mathulators["addition"](el);
            } else {
                mathulators["subtraction"](el);
            }
        },
        "multiplication and division": function(el) {
            if(Math.random() < 0.5) {
                mathulators["multiplication"](el);
            } else {
                mathulators["division"](el);
            }
        }
    };

    return {

        possibleWays: function() {
            return Object.keys(mathulators);
        },

        mathulate: function(within, sel, how) {
            var els = within.querySelectorAll(sel);
            els.forEach(function(el) {
                mathulators[how](el);
            });
        },
    };
}();


