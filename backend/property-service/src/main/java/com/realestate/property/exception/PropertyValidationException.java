package com.realestate.property.exception;

import org.springframework.validation.Errors;

public class PropertyValidationException extends RuntimeException {
    private final Errors errors;

    public PropertyValidationException(String message, Errors errors) {
        super(message);
        this.errors = errors;
    }

    public Errors getErrors() {
        return errors;
    }
}