package com.example.demo.data.access;

import com.example.demo.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Integer> {
    // Find recommendations by user
    List<Recommendation> findByUserId(Integer userId);

    // Find recommendations for a specific movie
    List<Recommendation> findByMovieId(Integer movieId);

    // Find recommendations created after a specific date
    List<Recommendation> findByCreatedAtAfter(LocalDate date);

    // Custom query to find recommendations with most comments
    @Query("SELECT r FROM Recommendation r ORDER BY SIZE(r.comments) DESC")
    List<Recommendation> findMostCommentedRecommendations();

    // Find recommendations by user and movie
    Optional<Recommendation> findByUserIdAndMovieId(Integer userId, Integer movieId);
}
