package com.realestate.transaction.model;

public enum TransactionStatus {
    INITIATED,
    DOCUMENT_COLLECTION,
    PAYMENT_PENDING,
    PAYMENT_COMPLETED,
    DOCUMENT_VERIFICATION,
    COMPLETED,
    CANCELLED
}