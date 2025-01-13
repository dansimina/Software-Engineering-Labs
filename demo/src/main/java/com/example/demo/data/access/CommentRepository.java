package com.example.demo.data.access;

import com.example.demo.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    // Find comments by recommendation ID, ordered by creation date
    @Query("SELECT c FROM Comment c " +
            "LEFT JOIN FETCH c.user " +
            "WHERE c.recommendation.id = :recommendationId " +
            "ORDER BY c.createdAt DESC")
    List<Comment> findByRecommendationIdOrderByCreatedAtDesc(@Param("recommendationId") Integer recommendationId);

    // Find comments by user ID, ordered by creation date
    @Query("SELECT c FROM Comment c " +
            "LEFT JOIN FETCH c.recommendation " +
            "WHERE c.user.id = :userId " +
            "ORDER BY c.createdAt DESC")
    List<Comment> findByUserId(@Param("userId") Integer userId);

    // Count comments for a recommendation
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.recommendation.id = :recommendationId")
    Integer countByRecommendationId(@Param("recommendationId") Integer recommendationId);

    // Find comment by ID with user and recommendation data
    @Query("SELECT c FROM Comment c " +
            "LEFT JOIN FETCH c.user " +
            "LEFT JOIN FETCH c.recommendation " +
            "WHERE c.id = :commentId")
    Optional<Comment> findByIdWithDetails(@Param("commentId") Integer commentId);

    // Find comments created after a specific date
    List<Comment> findByCreatedAtAfter(LocalDate date);

    // Find recent comments with limit
    @Query(value = "SELECT c FROM Comment c " +
            "LEFT JOIN FETCH c.user " +
            "LEFT JOIN FETCH c.recommendation " +
            "ORDER BY c.createdAt DESC")
    List<Comment> findRecentComments();

    // Search comments by content
    @Query("SELECT c FROM Comment c " +
            "LEFT JOIN FETCH c.user " +
            "WHERE LOWER(c.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "ORDER BY c.createdAt DESC")
    List<Comment> searchByContent(@Param("searchTerm") String searchTerm);

    // Get comment count by user
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.user.id = :userId")
    Integer countByUserId(@Param("userId") Integer userId);
}