
var mathulars = function() {

    class Mathulator {
        mathulate(el, prob) {
            el.textContent = prob + ' = ______________';
        }

        operands(how_many, min, range) {
            var ops = new Array();
            for(var ind = 0; ind < how_many; ind++) {
                ops[ind] = min + Math.floor(Math.random() * (range-min));
            }
            return ops;
        }
    };

    var mathulators = {
        "addition": class extends Mathulator {
            mathulate(el) {
                super.mathulate(el, this.operands(2, 1, 1000).join(' + '));
            }
        },
        "subtraction": class extends Mathulator {
            mathulate(el) {
                var ops = this.operands(2, 1, 1000);
                if(ops[0] > ops[1]) {
                    var tmp = ops[0];
                    ops[0] = ops[1];
                    ops[1] = tmp;
                }
                super.mathulate(el, this.operands(2, 100, 1000).join(' - '));
            }
        },
        "multiplication": class extends Mathulator {
            mathulate(el) {
                super.mathulate(el, this.operands(2, 1, 12).join(' x '));
            }
        },
        "division": class extends Mathulator {
            mathulate(el) {
                var ops = this.operands(2, 1, 12);
                ops[0] = ops[0] * ops[1];
                super.mathulate(el, ops.join(' ÷ '));
            }
        },
    };

    return {

        possibleWays: function() {
            return Object.keys(mathulators);
        },

        mathulate: function(within, sel, how) {
            var mulater = new mathulators[how]();

            var els = within.querySelectorAll(sel);
            els.forEach(function(el) {
                mulater.mathulate(el);
            });
        },
    };
}();


