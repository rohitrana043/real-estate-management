package com.realestate.transaction.controller;

import com.realestate.transaction.service.mock.MockStripeService;
import com.realestate.transaction.service.PaymentService;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/test")
@Profile("local")
@RequiredArgsConstructor
public class TestController {
    private final MockStripeService mockStripeService;
    private final PaymentService paymentService;

    @PostMapping("/payment/{paymentIntentId}/success")
    public ResponseEntity<String> simulatePaymentSuccess(@PathVariable String paymentIntentId) {
        mockStripeService.simulatePaymentSuccess(paymentIntentId);
        paymentService.processPayment(paymentIntentId);
        return ResponseEntity.ok("Payment simulated as successful");
    }

    @PostMapping("/payment/{paymentIntentId}/failure")
    public ResponseEntity<String> simulatePaymentFailure(@PathVariable String paymentIntentId) {
        mockStripeService.simulatePaymentFailure(paymentIntentId);
        paymentService.processPayment(paymentIntentId);
        return ResponseEntity.ok("Payment simulated as failed");
    }

    @PostMapping("/refund/{refundId}/status")
    public ResponseEntity<String> simulateRefundStatus(
            @PathVariable String refundId,
            @RequestParam String status) {
        mockStripeService.simulateRefundStatusChange(refundId, status);
        return ResponseEntity.ok("Refund status updated");
    }
}