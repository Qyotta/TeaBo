package de.bht.swp.lao.ocp.exceptions;

/**
 * This class encapsulates Exceptions which occurred while Databaseaccessing
 * 
 */
public class OCPDBException extends RuntimeException {

    private static final long serialVersionUID = 8047659705906774400L;

    public OCPDBException(String message, Throwable cause) {
        super(message, cause);
    }

}
