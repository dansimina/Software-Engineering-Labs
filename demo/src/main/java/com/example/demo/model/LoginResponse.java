package com.example.demo.model;

import com.example.demo.dto.UserDTO;

public class LoginResponse {
    private String message;
    private Boolean status;
    private UserDTO user;

    public LoginResponse(String message, Boolean status, UserDTO user) {
        this.message = message;
        this.status = status;
        this.user = user;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}
