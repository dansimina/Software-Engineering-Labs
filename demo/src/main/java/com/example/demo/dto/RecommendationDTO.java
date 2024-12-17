package com.example.demo.dto;

import java.time.LocalDate;

public class RecommendationDTO {
    private Integer id;
    private UserDTO user;
    private MovieDTO movie;
    private String content;
    private LocalDate createdAt;
    private int commentCount;

    // Constructors, getters, and setters
    public RecommendationDTO() {}

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }

    public MovieDTO getMovie() { return movie; }
    public void setMovie(MovieDTO movie) { this.movie = movie; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

    public int getCommentCount() { return commentCount; }
    public void setCommentCount(int commentCount) { this.commentCount = commentCount; }
}
