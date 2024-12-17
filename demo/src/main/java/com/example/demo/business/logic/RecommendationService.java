package com.example.demo.business.logic;

import com.example.demo.data.access.MovieRepository;
import com.example.demo.data.access.RecommendationRepository;
import com.example.demo.data.access.UserRepository;
import jakarta.transaction.Transactional;
import com.example.demo.model.Movie;
import com.example.demo.model.Recommendation;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    @Autowired
    public RecommendationService(RecommendationRepository recommendationRepository,
                                 UserRepository userRepository,
                                 MovieRepository movieRepository) {
        this.recommendationRepository = recommendationRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    @Transactional
    public Recommendation createRecommendation(Integer userId, Integer movieId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Optional<Recommendation> existingRecommendation =
                recommendationRepository.findByUserIdAndMovieId(userId, movieId);
        if (existingRecommendation.isPresent()) {
            throw new RuntimeException("User has already recommended this movie");
        }

        Recommendation recommendation = new Recommendation();
        recommendation.setUser(user);
        recommendation.setMovie(movie);
        recommendation.setContent(content);
        recommendation.setCreatedAt(LocalDate.now());
        return recommendationRepository.save(recommendation);
    }

    public List<Recommendation> findByUserId(Integer userId) {
        return recommendationRepository.findByUserId(userId);
    }

    public List<Recommendation> findByMovieId(Integer movieId) {
        return recommendationRepository.findByMovieId(movieId);
    }

    public List<Recommendation> getMostCommentedRecommendations() {
        return recommendationRepository.findMostCommentedRecommendations();
    }

    public List<Recommendation> getRecommendationsFromFollowedUsers(Integer userId) {
        return recommendationRepository.findRecommendationsFromFollowedUsers(userId);
    }
}