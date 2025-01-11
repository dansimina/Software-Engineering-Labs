package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;

@Entity
@Table(name = "comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)  // Changed to EAGER loading
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "email", "recommendations", "comments", "following", "followers"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)  // Changed to EAGER loading
    @JoinColumn(name = "recommendation_id", nullable = false)
    @JsonIgnoreProperties({"user", "comments"})
    private Recommendation recommendation;

    @Column(name = "content", length = 10000)
    private String content;

    @Column(name = "created_at")
    private LocalDate createdAt;

    // Getters and Setters
    public Integer getId() { return id; }
    public User getUser() { return user; }
    public Recommendation getRecommendation() { return recommendation; }
    public String getContent() { return content; }
    public LocalDate getCreatedAt() { return createdAt; }

    public void setUser(User user) { this.user = user; }
    public void setRecommendation(Recommendation recommendation) { this.recommendation = recommendation; }
    public void setContent(String content) { this.content = content; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}