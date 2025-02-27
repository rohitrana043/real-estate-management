package com.realestate.property.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorite_properties",
        uniqueConstraints = @UniqueConstraint(columnNames = {"property_id", "user_email"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructor for easy creation
    public FavoriteProperty(Property property, String userEmail) {
        this.property = property;
        this.userEmail = userEmail;
    }
}