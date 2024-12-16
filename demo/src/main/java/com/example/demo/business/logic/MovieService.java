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

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie save(Movie movie) {
        if (movie.getCreatedAt() == null) {
            movie.setCreatedAt(LocalDate.now());
        }
        return movieRepository.save(movie);
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
