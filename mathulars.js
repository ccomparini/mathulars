
var mathulars = function() {

    function mathulate(el, prob) {
        el.textContent = prob + ' = __________';
    }
    
    function operands(how_many, min, max) {
        var ops = new Array();
        for(var ind = 0; ind < how_many; ind++) {
            ops[ind] = min + Math.floor(Math.random() * (max - min + 1));
        }
        return ops;
    }

    var already_done = { };
    function already_done_key(ops, within) {
        var parts = ops.map((x) => x); // array copy
        parts.sort();
        parts.push(within);
        return parts.join('.');
    }

    // not totally guaranteed to be unique, but guaranteed to
    // terminate.  ;)
    function unique_operands(how_many, min, max, within) {
        var ops, key;
        var attempts = 0; // try up to 10 times to get a unique set of operands
        do {
            ops = operands(how_many, min, max);
            key = already_done_key(ops, within);
        } while(already_done[key] && ++attempts < 10);
        already_done[key] = true;

        return ops;
    }

    function reset_mathulators() {
        already_done = { };
    }

    var mathulators = {
        "addition": function(el) {
            mathulate(el, unique_operands(2, 1, 1000, '+').join(' + '));
        },
        "subtraction": function(el) {
            var ops = unique_operands(2, 1, 1000, '-');
            if(ops[0] < ops[1]) {
                // swap so the result is positive:
                var tmp = ops[0];
                ops[0] = ops[1];
                ops[1] = tmp;
            }
            mathulate(el, ops.join(' - '));
        },
        "multiplication": function(el) {
            mathulate(el, unique_operands(2, 2, 12, 'x').join(' x '));
        },
        "division": function(el) {
            // to get whole numbers only (and multiples of
            // 2-12) we generate 2 random factors and then
            // make the first operand be the product of the
            // 2 randoms:
            var ops = unique_operands(2, 2, 12, '÷');
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

        /**
           Returns a list containing the names of the supported
           problem types.
         */
        problemTypes: function() {
            return Object.keys(mathulators);
        },

        /**
           Fills the text content of the elements specified by
           the (css) selector passed with problems of the type
           specified by "problemType".
         */
        fillElements: function(selector, problemType, within = document) {
            reset_mathulators();
            var els = within.querySelectorAll(selector);
            els.forEach(function(el) {
                mathulators[problemType](el);
            });
        },
    };
}();


