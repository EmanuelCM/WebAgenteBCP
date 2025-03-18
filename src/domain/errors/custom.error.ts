

export class CustomError extends Error{

    private constructor(
        public readonly statusCode:number,
        public readonly message:string,


    ){
        super(message)
    }

    //* Un factory Constructor para que al llamar la funcion ya no se tenga estar 
    //* detallando el codigo de error solo la funcion segun el tipo de error 

    static badRequest(message: string) {
        return new CustomError(400, message);
    }

    static unauthorized(message: string) {
        return new CustomError(401, message);
    }

    static paymentRequired(message: string) {
        return new CustomError(402, message);
    }

    static forbidden(message: string) {
        return new CustomError(403, message);
    }

    static notFound(message: string) {
        return new CustomError(404, message);
    }

    static methodNotAllowed(message: string) {
        return new CustomError(405, message);
    }

    static notAcceptable(message: string) {
        return new CustomError(406, message);
    }

    static proxyAuthenticationRequired(message: string) {
        return new CustomError(407, message);
    }

    static requestTimeout(message: string) {
        return new CustomError(408, message);
    }

    static conflict(message: string) {
        return new CustomError(409, message);
    }

    static gone(message: string) {
        return new CustomError(410, message);
    }

    static lengthRequired(message: string) {
        return new CustomError(411, message);
    }

    static preconditionFailed(message: string) {
        return new CustomError(412, message);
    }

    static payloadTooLarge(message: string) {
        return new CustomError(413, message);
    }

    static uriTooLong(message: string) {
        return new CustomError(414, message);
    }

    static unsupportedMediaType(message: string) {
        return new CustomError(415, message);
    }

    static rangeNotSatisfiable(message: string) {
        return new CustomError(416, message);
    }

    static expectationFailed(message: string) {
        return new CustomError(417, message);
    }

    static imATeapot(message: string) {
        return new CustomError(418, message);
    }

    static tooManyRequests(message: string) {
        return new CustomError(429, message);
    }

    static internalServer(message: string) {
        return new CustomError(500, message);
    }

    static notImplemented(message: string) {
        return new CustomError(501, message);
    }

    static badGateway(message: string) {
        return new CustomError(502, message);
    }

    static serviceUnavailable(message: string) {
        return new CustomError(503, message);
    }

    static gatewayTimeout(message: string) {
        return new CustomError(504, message);
    }
}