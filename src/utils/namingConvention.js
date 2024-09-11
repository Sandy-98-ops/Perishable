// utils/namingConvention.js
export const toSnakeCase = (str) => {
    return str.replace(/[A-Z]/g, (letter, index) =>
        (index ? '_' : '') + letter.toLowerCase()
    );
};
