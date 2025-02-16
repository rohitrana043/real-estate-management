package com.realestate.transaction.controller;

import com.realestate.transaction.service.TransactionService;
import com.realestate.transaction.dto.TransactionDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(@RequestBody TransactionDTO transactionDTO) {
        return ResponseEntity.ok(transactionService.createTransaction(transactionDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransaction(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransaction(id));
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByBuyer(@PathVariable Long buyerId) {
        return ResponseEntity.ok(transactionService.getTransactionsByBuyer(buyerId));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(transactionService.getTransactionsBySeller(sellerId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TransactionDTO> updateTransactionStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(transactionService.updateTransactionStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}