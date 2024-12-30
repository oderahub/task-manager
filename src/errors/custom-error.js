// class CustomAPIError extends Error {
//     constructor(message, statusCode) {
//         super(message)
//         this.statusCode = statusCode
//     }
// }

// const createCustomError = (message, statusCode) => {
//     return new CustomAPIError(message, statusCode)
// }

// module.exports = { createCustomError, CustomAPIError }

// errors/custom-error.js
class CustomAPIError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}

const createCustomError = (message, statusCode) => {
    return new CustomAPIError(message, statusCode)
}
module.exports = { CustomAPIError, createCustomError };
