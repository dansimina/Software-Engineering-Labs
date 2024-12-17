package com.example.demo.dto;

import java.time.LocalDate;
import java.util.List;

public class UserDTO {
    private Integer id;
    private String username;
    private String password;
    private String email;
    private String surename;
    private String forename;
    private String role;
    private String description;
    private LocalDate registrationDate;
    private List<Integer> recommendationIds;
    private List<Integer> commentIds;
    private List<Integer> followingIds;
    private List<Integer> followerIds;

    public UserDTO() {
    }

    public UserDTO(Integer id, String username, String password, String email,
                   String surename, String forename, String role, String description,
                   LocalDate registrationDate, List<Integer> recommendationIds,
                   List<Integer> commentIds, List<Integer> followingIds,
                   List<Integer> followerIds) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.surename = surename;
        this.forename = forename;
        this.role = role;
        this.description = description;
        this.registrationDate = registrationDate;
        this.recommendationIds = recommendationIds;
        this.commentIds = commentIds;
        this.followingIds = followingIds;
        this.followerIds = followerIds;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSurename() {
        return surename;
    }

    public void setSurename(String surename) {
        this.surename = surename;
    }

    public String getForename() {
        return forename;
    }

    public void setForename(String forename) {
        this.forename = forename;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public List<Integer> getRecommendationIds() {
        return recommendationIds;
    }

    public void setRecommendationIds(List<Integer> recommendationIds) {
        this.recommendationIds = recommendationIds;
    }

    public List<Integer> getCommentIds() {
        return commentIds;
    }

    public void setCommentIds(List<Integer> commentIds) {
        this.commentIds = commentIds;
    }

    public List<Integer> getFollowingIds() {
        return followingIds;
    }

    public void setFollowingIds(List<Integer> followingIds) {
        this.followingIds = followingIds;
    }

    public List<Integer> getFollowerIds() {
        return followerIds;
    }

    public void setFollowerIds(List<Integer> followerIds) {
        this.followerIds = followerIds;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", surename='" + surename + '\'' +
                ", forename='" + forename + '\'' +
                ", role='" + role + '\'' +
                ", description='" + description + '\'' +
                ", registrationDate=" + registrationDate +
                ", recommendationIds=" + recommendationIds +
                ", commentIds=" + commentIds +
                ", followingIds=" + followingIds +
                ", followerIds=" + followerIds +
                '}';
    }
}