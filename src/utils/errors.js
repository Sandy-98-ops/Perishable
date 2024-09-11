// utils/errors.js

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400; // Bad Request
    }

}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404; // Not Found
    }
    
}

class BadRequestError extends Error {
    constructor(message) {
    super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400; // Bad Request
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConflictError';
        this.statusCode = 409; // Conflict
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401; // Unauthorized
    }
}

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403; // Forbidden
    }
}

class InternalServerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InternalServerError';
        this.statusCode = 500; // Internal Server Error
    }
}

class NotImplementedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotImplementedError';
        this.statusCode = 501; // Not Implemented
    }
}

class ServiceUnavailableError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ServiceUnavailableError';
        this.statusCode = 503; // Service Unavailable
    }
}

export {
    ValidationError,
    NotFoundError,
    BadRequestError,
    ConflictError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
    NotImplementedError,
    ServiceUnavailableError
};
