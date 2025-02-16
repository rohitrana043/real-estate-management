package com.realestate.transaction.model.mock;

import com.stripe.model.Refund;

public class MockRefund extends Refund {
    private String id;
    private String paymentIntent;
    private Long amount;
    private String status;
    private String reason;

    public MockRefund(String id, String paymentIntent, Long amount, String status) {
        this.id = id;
        this.paymentIntent = paymentIntent;
        this.amount = amount;
        this.status = status;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String getPaymentIntent() {
        return paymentIntent;
    }

    @Override
    public Long getAmount() {
        return amount;
    }

    @Override
    public String getStatus() {
        return status;
    }

    @Override
    public String getReason() {
        return reason;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}