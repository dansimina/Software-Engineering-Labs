package com.example.demo.dto;

import java.time.LocalDateTime;

public class MessageDTO {
    private Integer id;
    private UserDTO sender;
    private UserDTO receiver;
    private String content;
    private LocalDateTime sentAt;
    private boolean isRead;

    // Default constructor
    public MessageDTO() {
    }

    // Constructor with all fields
    public MessageDTO(Integer id, UserDTO sender, UserDTO receiver, String content,
                      LocalDateTime sentAt, boolean isRead) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.sentAt = sentAt;
        this.isRead = isRead;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public UserDTO getSender() {
        return sender;
    }

    public void setSender(UserDTO sender) {
        this.sender = sender;
    }

    public UserDTO getReceiver() {
        return receiver;
    }

    public void setReceiver(UserDTO receiver) {
        this.receiver = receiver;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
}