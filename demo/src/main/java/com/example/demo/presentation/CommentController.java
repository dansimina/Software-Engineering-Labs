package com.example.demo.presentation;

import com.example.demo.business.logic.CommentService;
import com.example.demo.dto.CommentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/recommendation/{recommendationId}")
    public ResponseEntity<List<CommentDTO>> getRecommendationComments(@PathVariable Integer recommendationId) {
        try {
            System.out.println("Fetching comments for recommendation ID: " + recommendationId);
            List<CommentDTO> comments = commentService.findByRecommendationId(recommendationId);
            System.out.println("Found " + comments.size() + " comments");
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<CommentDTO> createComment(@RequestBody Map<String, Object> request) {
        try {
            Integer userId = (Integer) request.get("userId");
            Integer recommendationId = (Integer) request.get("recommendationId");
            String content = (String) request.get("content");

            System.out.println("Creating comment: userId=" + userId +
                    ", recommendationId=" + recommendationId +
                    ", content=" + content);

            CommentDTO comment = commentService.createComment(userId, recommendationId, content);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/count/{recommendationId}")
    public ResponseEntity<Integer> getCommentCount(@PathVariable Integer recommendationId) {
        try {
            Integer count = commentService.getCommentCountForRecommendation(recommendationId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}