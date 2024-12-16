package com.example.demo.dto;

import com.example.demo.model.Comment;
import com.example.demo.model.FollowedUser;
import com.example.demo.model.Recommendation;
import jakarta.persistence.*;

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
    private List<Recommendation> recommendations;
    private List<Comment> comments;
    private List<FollowedUser> following;
    private List<FollowedUser> followers;

    public UserDTO(Integer id, String username, String password, String email, String surename, String forename, String role, String description, LocalDate registrationDate, List<Recommendation> recommendations, List<Comment> comments, List<FollowedUser> following, List<FollowedUser> followers) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.surename = surename;
        this.forename = forename;
        this.role = role;
        this.description = description;
        this.registrationDate = registrationDate;
        this.recommendations = recommendations;
        this.comments = comments;
        this.following = following;
        this.followers = followers;
    }

    public UserDTO() {
    }

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

    public List<Recommendation> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<Recommendation> recommendations) {
        this.recommendations = recommendations;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<FollowedUser> getFollowing() {
        return following;
    }

    public void setFollowing(List<FollowedUser> following) {
        this.following = following;
    }

    public List<FollowedUser> getFollowers() {
        return followers;
    }

    public void setFollowers(List<FollowedUser> followers) {
        this.followers = followers;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", surename='" + surename + '\'' +
                ", forename='" + forename + '\'' +
                ", role='" + role + '\'' +
                ", description='" + description + '\'' +
                ", registrationDate=" + registrationDate +
                ", recommendations=" + recommendations +
                ", comments=" + comments +
                ", following=" + following +
                ", followers=" + followers +
                '}';
    }
}
