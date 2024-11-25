module.exports = class {
    constructor(label = null) {
        this.label = label;
    }

    debug(...args) {
        console.log(...args);
    }

    log(...args) {
        console.log(...args);
    }

    error(...args) {
        console.error(...args);
    }

    group(label = this.label) {
        console.group(label);
    }

    groupEnd() {
        console.groupEnd();
    }
}