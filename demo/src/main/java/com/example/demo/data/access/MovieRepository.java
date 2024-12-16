package com.example.demo.data.access;

import com.example.demo.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {
    // Find movies by title (partial match)
    List<Movie> findByTitleContaining(String title);

    // Find movies by release year
    List<Movie> findByReleaseYear(LocalDate year);

    // Find movies by genre
    List<Movie> findByGenresContaining(String genre);

    // Find movies by director
    List<Movie> findByDirector(String director);

    // Custom query to find most recommended movies
    @Query("SELECT m FROM Movie m ORDER BY SIZE(m.recommendations) DESC")
    List<Movie> findMostRecommendedMovies();

    // Find movies created after a specific date
    List<Movie> findByCreatedAtAfter(LocalDate date);
}
