package com.example.demo.business.logic;

import com.example.demo.data.access.MovieRepository;
import com.example.demo.model.Movie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private static final int MAX_BASE64_LENGTH = 2_000_000; // 2MB limit for base64 strings

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie save(Movie movie) {
        if (movie.getCreatedAt() == null) {
            movie.setCreatedAt(LocalDate.now());
        }

        // Validate poster if it exists
        if (movie.getPoster() != null) {
            validateBase64Image(movie.getPoster());
        }

        return movieRepository.save(movie);
    }

    private void validateBase64Image(String base64String) {
        // Check if it's a valid base64 image string
        if (!base64String.startsWith("data:image")) {
            throw new IllegalArgumentException("Invalid image format. Must be a base64 image string");
        }

        // Check size
        if (base64String.length() > MAX_BASE64_LENGTH) {
            throw new IllegalArgumentException("Image too large. Maximum size is 2MB");
        }
    }

    public List<Movie> findAll() {
        return movieRepository.findAll();
    }

    public Optional<Movie> findById(Integer id) {
        return movieRepository.findById(id);
    }

    public List<Movie> findByTitle(String title) {
        return movieRepository.findByTitleContaining(title);
    }

    public List<Movie> findByGenre(String genre) {
        return movieRepository.findByGenresContaining(genre);
    }

    public List<Movie> getMostRecommendedMovies() {
        return movieRepository.findMostRecommendedMovies();
    }

    public List<Movie> findByDirector(String director) {
        return movieRepository.findByDirector(director);
    }
}