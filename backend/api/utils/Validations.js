module.exports.isString = str => {
    return typeof str === 'string';
};

module.exports.minLength = (str, len) => {
    if (str == null)
        return false;
    return str.length >= len;
};

module.exports.isEmail = str => {
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(str);
};

module.exports.isPassword = str => {
    var hasSpecialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return /\d/.test(str) && /[A-Z]/.test(str) && /[a-z]/.test(str) && hasSpecialChar.test(str);
};

module.exports.isNumber = num => {
    return !isNaN(num);
};

module.exports.isBoolean = bool => {
    return (
        bool === true ||
        bool === false ||
        toString.call(bool) === '[object Boolean]'
    );
};

module.exports.isObject = obj => {
    return typeof obj === 'object';
};

module.exports.isArray = arr => {
    return Array.isArray(arr);
};

module.exports.matchesRegex = (str, regex) => {
    return regex.test(str);
};
