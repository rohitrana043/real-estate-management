package com.realestate.transaction.service.mock;

import com.realestate.transaction.model.mock.MockPaymentIntent;
import com.realestate.transaction.model.mock.MockRefund;
import com.realestate.transaction.service.StripeService;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Profile("local") // This will only be active in local profile
public class MockStripeService extends StripeService {
    private final Map<String, MockPaymentIntent> paymentIntents = new HashMap<>();
    private final Map<String, MockRefund> refunds = new HashMap<>();

    @Override
    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency) {
        String paymentIntentId = "pi_" + UUID.randomUUID().toString().replace("-", "");
        String clientSecret = "secret_" + UUID.randomUUID().toString().replace("-", "");

        MockPaymentIntent paymentIntent = new MockPaymentIntent(
                paymentIntentId,
                clientSecret,
                amount.multiply(new BigDecimal("100")).longValue(),
                currency,
                "requires_payment_method"
        );

        paymentIntents.put(paymentIntentId, paymentIntent);
        return paymentIntent;
    }

    @Override
    public PaymentIntent retrievePaymentIntent(String paymentIntentId) {
        MockPaymentIntent paymentIntent = paymentIntents.get(paymentIntentId);
        if (paymentIntent == null) {
            throw new RuntimeException("PaymentIntent not found: " + paymentIntentId);
        }
        return paymentIntent;
    }

    @Override
    public Refund createRefund(String paymentIntentId, Long amount) {
        String refundId = "re_" + UUID.randomUUID().toString().replace("-", "");

        MockRefund refund = new MockRefund(
                refundId,
                paymentIntentId,
                amount,
                "succeeded"
        );

        refunds.put(refundId, refund);
        return refund;
    }

    @Override
    public Refund retrieveRefund(String refundId) {
        MockRefund refund = refunds.get(refundId);
        if (refund == null) {
            throw new RuntimeException("Refund not found: " + refundId);
        }
        return refund;
    }

    // Helper method to simulate payment success
    public void simulatePaymentSuccess(String paymentIntentId) {
        MockPaymentIntent paymentIntent = paymentIntents.get(paymentIntentId);
        if (paymentIntent != null) {
            paymentIntent.setStatus("succeeded");
        }
    }

    // Helper method to simulate payment failure
    public void simulatePaymentFailure(String paymentIntentId) {
        MockPaymentIntent paymentIntent = paymentIntents.get(paymentIntentId);
        if (paymentIntent != null) {
            paymentIntent.setStatus("failed");
        }
    }

    // Helper method to simulate refund status change
    public void simulateRefundStatusChange(String refundId, String newStatus) {
        MockRefund refund = refunds.get(refundId);
        if (refund != null) {
            refund.setStatus(newStatus);
        }
    }
}