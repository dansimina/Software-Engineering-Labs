package com.example.demo.dto;

import java.time.LocalDate;

public class CommentDTO {
    private Integer id;
    private UserDTO user;
    private Integer recommendationId;
    private String content;
    private LocalDate createdAt;

    // Default constructor
    public CommentDTO() {
    }

    // Constructor with all fields
    public CommentDTO(Integer id, UserDTO user, Integer recommendationId, String content, LocalDate createdAt) {
        this.id = id;
        this.user = user;
        this.recommendationId = recommendationId;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Integer getRecommendationId() {
        return recommendationId;
    }

    public void setRecommendationId(Integer recommendationId) {
        this.recommendationId = recommendationId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
}