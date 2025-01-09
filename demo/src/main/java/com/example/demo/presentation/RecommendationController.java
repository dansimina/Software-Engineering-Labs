package com.example.demo.presentation;

import com.example.demo.business.logic.MovieService;
import com.example.demo.business.logic.RecommendationService;
import com.example.demo.data.access.RecommendationRepository;
import com.example.demo.dto.RecommendationDTO;
import com.example.demo.model.Recommendation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("api/v1/recommendations")
public class RecommendationController {
    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/followed/{userId}")
    public ResponseEntity<List<RecommendationDTO>> getRecommendationsFromFollowedUsers(
            @PathVariable Integer userId) {
        List<RecommendationDTO> recommendations =
                recommendationService.getRecommendationsFromFollowedUsers(userId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationDTO>> getUserRecommendations(@PathVariable Integer userId) {
        List<Recommendation> recommendations = recommendationService.findByUserId(userId);
        List<RecommendationDTO> recommendationDTOs = recommendations.stream()
                .map(recommendationService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recommendationDTOs);
    }

    @PostMapping("/create")
    public ResponseEntity<Recommendation> createRecommendation(@RequestBody Map<String, Object> request) {
        Integer userId = (Integer) request.get("userId");
        Integer movieId = (Integer) request.get("movieId");
        String content = (String) request.get("content");

        Recommendation recommendation = recommendationService.createRecommendation(userId, movieId, content);
        return ResponseEntity.ok(recommendation);
    }

    // Add this new endpoint to RecommendationController.java

    @GetMapping("/{id}")
    public ResponseEntity<RecommendationDTO> getRecommendationById(@PathVariable Integer id) {
        try {
            RecommendationRepository recommendationRepository;
            Optional<Recommendation> recommendationOptional = recommendationService.findById(id);
            if (recommendationOptional.isPresent()) {
                RecommendationDTO dto = recommendationService.convertToDTO(recommendationOptional.get());
                return ResponseEntity.ok(dto);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<RecommendationDTO>> getMovieRecommendations(@PathVariable Integer movieId) {
        List<Recommendation> recommendations = recommendationService.findByMovieId(movieId);
        List<RecommendationDTO> recommendationDTOs = recommendations.stream()
                .map(recommendationService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recommendationDTOs);
    }
}