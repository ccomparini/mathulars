"use strict";

var mathulars = function() {

    function mathulate(el, prob) {
        el.textContent = prob + ' = __________';
    }

    function randint(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    function operands(how_many, min, max) {
        let ops = new Array();
        for(let ind = 0; ind < how_many; ind++) {
            ops[ind] = randint(min, max);
        }
        return ops;
    }

    let already_done = { };
    function already_done_key(ops, within) {
        let parts = ops.map((x) => x); // array copy
        parts.sort();
        parts.push(within);
        return parts.join('.');
    }

    // returns an array of 2 "unique" (since the last time reset_mathulators()
    // was called) operands for a problem.
    // not totally guaranteed to be unique, but guaranteed to
    // terminate.  ;)
    function unique_operands(min, max, within) {
        let ops, key;
        let attempts = 0; // try up to 10 times to get a unique set of operands
        do {
            ops = operands(2, min, max);
            key = already_done_key(ops, within);
        } while(already_done[key] && ++attempts < 10);
        already_done[key] = true;

        return ops;
    }

    function reset_mathulators() {
        already_done = { };
    }

    const algebraIOps = [ ' + ', ' - ', ' * ', '/' ];
    const mathulators = {
        "algebra I": {
            fill: function(el) {
                // let's say for "algebra I" it's just a x someplace
                // and some constants and expect the kid to solve
                // for x.  no quadratics or anything - very simple.
                // uhh also just 3 terms.
                // more complex can go in II.
                // the html makes a lot of problems anyway.
                const terms = operands(3, 1, 100);
                const eqAfter = randint(0, terms.length - 2); // where the '=' is

                // the 'x' goes on the side with more terms:
                if(eqAfter < Math.floor(terms.length/2)) {
                    terms[randint(eqAfter + 1, terms.length - 1)] = 'x';
                } else {
                    terms[randint(0, eqAfter - 1)] = 'x';
                }

                // division is visually confusing the way I
                // have this layed out at the moment, so
                // we're going to have at most 1 division:
                let gotDiv = false;
                for(let termi = 0; termi < terms.length; termi++) {
                    if(termi === eqAfter) {
                        el.textContent += `${terms[termi]} = `;
                    } else if(termi < terms.length - 1) {
                        let op = algebraIOps[randint(0, algebraIOps.length - 1)];
                        if(op === '/') {
                            if(gotDiv) op = ' * ';
                            gotDiv = true;
                        }
                        el.textContent += `${terms[termi]}${op}`;
                    } else {
                        el.textContent += terms[termi];
                    }
                }
            },
        },
        "addition": {
            fill: function(el) {
                mathulate(el, unique_operands(1, 1000, '+').join(' + '));
            },
        },
        "subtraction": {
            fill: function(el) {
                let ops = unique_operands(1, 1000, '-');
                if(ops[0] < ops[1]) {
                    // swap so the result is positive:
                    let tmp = ops[0];
                    ops[0] = ops[1];
                    ops[1] = tmp;
                }
                mathulate(el, ops.join(' - '));
            },
        },
        "multiplication": {
            fill: function(el) {
                mathulate(el, unique_operands(2, 12, 'x').join(' x '));
            },
        },
        "division": {
            fill: function(el) {
                // to get whole numbers only (and multiples of
                // 2-12) we generate 2 random factors and then
                // make the first operand be the product of the
                // 2 randoms:
                let ops = unique_operands(2, 12, '÷');
                ops[0] = ops[0] * ops[1];
                mathulate(el, ops.join(' ÷ '));
            },
        },
        "multi-digit multiplication": {
            fill: function(el) {
                mathulate(el, unique_operands(10, 1000, 'x').join(' x '));
            },
            max_probs_factor: .25,
        },
        "multi-digit division": {
            // going into 5th grade they are supposed to be able to do
            // "Dividing a three- or four-digit number by a two digit
            // divisor using partial quotients or the standard long
            // division algorithm".  I'm going to not worry if they
            // are unique, here.
            fill: function(el) {
                // ... so always a 2 digit divisor:
                let divisor = operands(1, 10, 99);

                // instead of the dividend just being in the range
                // 100 - 9999, let's make it roughly 50/50 3 digit
                // and 4 digit (so it's not so intimidating):
                if(Math.random() < 0.5) {
                    // (3 digit)
                    mathulate(el, operands(1, 100, 999) + ' ÷ ' + divisor);
                } else {
                    // (4 digit)
                    mathulate(el, operands(1, 1000, 9999) + ' ÷ ' + divisor);
                }
            },
            max_probs_factor: 1/6, // awkward! shipit.
        },
        "addition and subtraction": {
            fill: function(el) {
                if(Math.random() < 0.5) {
                    mathulators["addition"].fill(el);
                } else {
                    mathulators["subtraction"].fill(el);
                }
            },
        },
        "multiplication and division": {
            fill: function(el) {
                if(Math.random() < 0.5) {
                    mathulators["multiplication"].fill(el);
                } else {
                    mathulators["division"].fill(el);
                }
            },
        },
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
            let mather = mathulators[problemType];

            let els = within.querySelectorAll(selector);
            let num_done = 0;
            let num_to_do = els.length;
            if(mather.max_probs_factor !== undefined)
                num_to_do *= mather.max_probs_factor;

            for(let elind = 0; elind < els.length; elind++) {
                let el = els[elind];
                if(num_done < num_to_do) {
                    mather.fill(el);
                    num_done++;
                } else {
                    el.textContent = ' ';
                }
            }
        },

        operands: operands,
    };
}();


