package com.example.demo.data.access;

import com.example.demo.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    // Find comments by user
    List<Comment> findByUserId(Integer userId);

    // Find comments for a specific recommendation
    List<Comment> findByRecommendationId(Integer recommendationId);

    // Find comments created after a specific date
    List<Comment> findByCreatedAtAfter(LocalDate date);

    // Count comments for a specific recommendation
    Integer countByRecommendationId(Integer recommendationId);
}
