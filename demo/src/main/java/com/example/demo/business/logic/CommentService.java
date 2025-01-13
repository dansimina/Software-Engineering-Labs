package com.example.demo.business.logic;

import com.example.demo.data.access.CommentRepository;
import com.example.demo.data.access.RecommendationRepository;
import com.example.demo.data.access.UserRepository;
import com.example.demo.dto.CommentDTO;
import com.example.demo.dto.UserDTO;
import jakarta.transaction.Transactional;
import com.example.demo.model.Comment;
import com.example.demo.model.Recommendation;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final RecommendationRepository recommendationRepository;
    private final UserService userService;

    @Autowired
    public CommentService(CommentRepository commentRepository,
                          UserRepository userRepository,
                          RecommendationRepository recommendationRepository,
                          UserService userService) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.recommendationRepository = recommendationRepository;
        this.userService = userService;
    }

    @Transactional
    public CommentDTO createComment(Integer userId, Integer recommendationId, String content) {
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

        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }

    public List<CommentDTO> findByRecommendationId(Integer recommendationId) {
        return commentRepository.findByRecommendationIdOrderByCreatedAtDesc(recommendationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CommentDTO> findByUserId(Integer userId) {
        return commentRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Integer getCommentCountForRecommendation(Integer recommendationId) {
        return commentRepository.countByRecommendationId(recommendationId);
    }

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setRecommendationId(comment.getRecommendation().getId());

        // Convert user to UserDTO using the existing UserService
        UserDTO userDTO = userService.convertToDTO(comment.getUser());
        dto.setUser(userDTO);

        return dto;
    }
}