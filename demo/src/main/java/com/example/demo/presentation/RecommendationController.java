package com.example.demo.presentation;

import com.example.demo.business.logic.RecommendationService;
import com.example.demo.model.Recommendation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/v1/recommendations")
public class RecommendationController {
    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/followed/{userId}")
    public ResponseEntity<List<Recommendation>> getRecommendationsFromFollowedUsers(
            @PathVariable Integer userId) {
        List<Recommendation> recommendations =
                recommendationService.getRecommendationsFromFollowedUsers(userId);
        return ResponseEntity.ok(recommendations);
    }
}