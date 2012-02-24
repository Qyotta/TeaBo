package de.bht.swp.lao.ocp.exceptions;

import javax.xml.ws.http.HTTPException;

/**
 * This class encapsulates Exceptions which occurred while trying to access a
 * file
 * 
 */
public class OCPHTTPException extends HTTPException {
    private static final long serialVersionUID = 4978535177251375565L;

    public enum HTTPCode {
        HTTP_404_NOT_FOUND(404), HTTP_401_UNAUTHORIZED_EXPLAINED(401);

        private final int code;

        private HTTPCode(int code) {
            this.code = code;
        }

        public int getCode() {
            return code;
        }
    }

    private final String message;

    public OCPHTTPException(HTTPCode statusCode, String message) {
        super(statusCode.getCode());
        this.message = message;
    }

    @Override
    public String getMessage() {
        return super.getMessage() + ": " + message;
    }

}
