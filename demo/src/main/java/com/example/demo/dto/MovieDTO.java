package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class MovieDTO {
    private Integer id;
    private String title;
    private String poster;
    private String description;
    private LocalDate releaseYear;
    private String genres;
    private LocalTime runtime;
    private String stars;
    private String director;
    private String trailer;

    public MovieDTO() {
    }

    public MovieDTO(Integer id, String title, String poster, String description, LocalDate releaseYear, String genres, LocalTime runtime, String stars, String director, String trailer) {
        this.id = id;
        this.title = title;
        this.poster = poster;
        this.description = description;
        this.releaseYear = releaseYear;
        this.genres = genres;
        this.runtime = runtime;
        this.stars = stars;
        this.director = director;
        this.trailer = trailer;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(LocalDate releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public LocalTime getRuntime() {
        return runtime;
    }

    public void setRuntime(LocalTime runtime) {
        this.runtime = runtime;
    }

    public String getStars() {
        return stars;
    }

    public void setStars(String stars) {
        this.stars = stars;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getTrailer() {
        return trailer;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    }
}