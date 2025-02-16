package com.realestate.transaction.model.mock;

import com.stripe.model.PaymentIntent;

public class MockPaymentIntent extends PaymentIntent {
    private String id;
    private String clientSecret;
    private Long amount;
    private String currency;
    private String status;

    public MockPaymentIntent(String id, String clientSecret, Long amount, String currency, String status) {
        this.id = id;
        this.clientSecret = clientSecret;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String getClientSecret() {
        return clientSecret;
    }

    @Override
    public Long getAmount() {
        return amount;
    }

    @Override
    public String getCurrency() {
        return currency;
    }

    @Override
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}