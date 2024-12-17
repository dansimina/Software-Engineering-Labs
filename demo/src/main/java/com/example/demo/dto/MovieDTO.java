package com.example.demo.dto;

public class MovieDTO {
    private Integer id;
    private String title;
    private String poster;

    // Constructors, getters, and setters
    public MovieDTO() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }
}
