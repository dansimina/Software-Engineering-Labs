package com.example.demo.business.logic;

import com.example.demo.data.access.CommentRepository;
import com.example.demo.data.access.RecommendationRepository;
import com.example.demo.data.access.UserRepository;
import jakarta.transaction.Transactional;
import com.example.demo.model.Comment;
import com.example.demo.model.Recommendation;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final RecommendationRepository recommendationRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository,
                          UserRepository userRepository,
                          RecommendationRepository recommendationRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.recommendationRepository = recommendationRepository;
    }

    @Transactional
    public Comment createComment(Integer userId, Integer recommendationId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Recommendation recommendation = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new RuntimeException("Recommendation not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setRecommendation(recommendation);
        comment.setContent(content.trim());
        comment.setCreatedAt(LocalDate.now());

        return commentRepository.save(comment);
    }

    public List<Comment> findByRecommendationId(Integer recommendationId) {
        return commentRepository.findByRecommendationId(recommendationId);
    }

    public List<Comment> findByUserId(Integer userId) {
        return commentRepository.findByUserId(userId);
    }

    public Integer getCommentCountForRecommendation(Integer recommendationId) {
        return commentRepository.countByRecommendationId(recommendationId);
    }
}