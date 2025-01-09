package com.example.demo.data.access;

import com.example.demo.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    @Query("SELECT c FROM Comment c WHERE c.recommendation.id = ?1 ORDER BY c.createdAt DESC")
    List<Comment> findByRecommendationId(Integer recommendationId);

    List<Comment> findByUserId(Integer userId);

    Integer countByRecommendationId(Integer recommendationId);
}