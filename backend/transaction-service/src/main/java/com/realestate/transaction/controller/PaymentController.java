package com.realestate.transaction.controller;

import com.realestate.transaction.dto.RefundDTO;
import com.realestate.transaction.service.PaymentService;
import com.realestate.transaction.dto.PaymentDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/transaction/{transactionId}")
    public ResponseEntity<PaymentDTO> initiatePayment(
            @PathVariable Long transactionId,
            @RequestBody PaymentDTO paymentDTO) {
        return ResponseEntity.ok(paymentService.initiatePayment(transactionId, paymentDTO));
    }

    @PostMapping("/process/{paymentReference}")
    public ResponseEntity<PaymentDTO> processPayment(
            @PathVariable String paymentReference) {
        return ResponseEntity.ok(paymentService.processPayment(paymentReference));
    }

    @GetMapping("/{paymentReference}")
    public ResponseEntity<PaymentDTO> getPaymentStatus(
            @PathVariable String paymentReference) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(paymentReference));
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<List<PaymentDTO>> getTransactionPayments(
            @PathVariable Long transactionId) {
        return ResponseEntity.ok(paymentService.getTransactionPayments(transactionId));
    }

    @PostMapping("/{paymentReference}/refund")
    public ResponseEntity<PaymentDTO> refundPayment(
            @PathVariable String paymentReference,
            @RequestParam BigDecimal amount) {
        return ResponseEntity.ok(paymentService.refundPayment(paymentReference, amount));
    }

    public ResponseEntity<RefundDTO> syncRefundStatus(@PathVariable String refundId) {
        return ResponseEntity.ok(paymentService.syncRefundStatus(refundId));
    }
}