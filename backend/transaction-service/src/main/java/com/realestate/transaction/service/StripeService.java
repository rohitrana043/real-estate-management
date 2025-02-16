package com.realestate.transaction.service;

import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class StripeService {

    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount.multiply(new BigDecimal("100")).longValue()) // Convert to cents
                    .setCurrency(currency)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            return PaymentIntent.create(params);
        } catch (Exception e) {
            throw new RuntimeException("Error creating payment intent: " + e.getMessage());
        }
    }

    public PaymentIntent retrievePaymentIntent(String paymentIntentId) {
        try {
            return PaymentIntent.retrieve(paymentIntentId);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving payment intent: " + e.getMessage());
        }
    }

    public Refund createRefund(String paymentIntentId, Long amount) {
        try {
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(paymentIntentId)
                    .setAmount(amount)
                    .build();

            return Refund.create(params);
        } catch (Exception e) {
            throw new RuntimeException("Error processing refund: " + e.getMessage());
        }
    }

    public Refund retrieveRefund(String refundId) {
        try {
            return Refund.retrieve(refundId);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving refund from Stripe: " + e.getMessage());
        }
    }
}