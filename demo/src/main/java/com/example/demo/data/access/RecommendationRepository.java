package com.example.demo.data.access;

import com.example.demo.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Integer> {
    // Find recommendations by user with ordering
    List<Recommendation> findByUserIdOrderByCreatedAtDesc(Integer userId);

    // Find recommendations for a specific movie with ordering
    List<Recommendation> findByMovieIdOrderByCreatedAtDesc(Integer movieId);

    // Find recommendations created after a specific date
    List<Recommendation> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDate date);

    // Find recommendations by user and movie on a specific date
    List<Recommendation> findByUserIdAndMovieIdAndCreatedAt(Integer userId, Integer movieId, LocalDate createdAt);

    // Custom query to find most commented recommendations
    @Query("SELECT r FROM Recommendation r ORDER BY SIZE(r.comments) DESC")
    List<Recommendation> findMostCommentedRecommendations();

    // Find recommendations from followed users with ordering
    @Query("""
        SELECT r FROM Recommendation r 
        WHERE r.user.id IN (
            SELECT fu.followed.id 
            FROM FollowedUser fu 
            WHERE fu.follower.id = :userId
        )
        ORDER BY r.createdAt DESC
    """)
    List<Recommendation> findRecommendationsFromFollowedUsersOrderByCreatedAtDesc(@Param("userId") Integer userId);

    // Get recommendation count for a movie
    Long countByMovieId(Integer movieId);
}