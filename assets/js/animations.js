// JS classes
import wheel from 'js/wheel.js'
import neon from 'js/neon.js'

// Use ES6 Object Literal Property Value Shorthand to maintain a map
// where the keys share the same names as the classes themselves
const animations = {
    wheel,
    neon
};

class animation {
    constructor (className, opts) {
        return new animations[className](opts);
    }
}

export default animation;