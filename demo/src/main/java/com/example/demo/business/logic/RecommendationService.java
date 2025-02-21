package com.example.demo.business.logic;

import com.example.demo.data.access.MovieRepository;
import com.example.demo.data.access.RecommendationRepository;
import com.example.demo.data.access.UserRepository;
import com.example.demo.dto.MovieDTO;
import com.example.demo.dto.RecommendationDTO;
import com.example.demo.dto.UserDTO;
import jakarta.transaction.Transactional;
import com.example.demo.model.Movie;
import com.example.demo.model.Recommendation;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Recommendation content cannot be empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        // Check for recommendations made in the last 24 hours
        List<Recommendation> recentRecommendations = recommendationRepository
                .findByUserIdAndMovieIdAndCreatedAt(userId, movieId, LocalDate.now());

        if (!recentRecommendations.isEmpty()) {
            throw new RuntimeException("You can only make one recommendation per movie per day");
        }

        Recommendation recommendation = new Recommendation();
        recommendation.setUser(user);
        recommendation.setMovie(movie);
        recommendation.setContent(content.trim());
        recommendation.setCreatedAt(LocalDate.now());

        return recommendationRepository.save(recommendation);
    }

    public List<Recommendation> findByUserId(Integer userId) {
        return recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Recommendation> findByMovieId(Integer movieId) {
        return recommendationRepository.findByMovieIdOrderByCreatedAtDesc(movieId);
    }

    public Optional<Recommendation> findById(Integer id) {
        return recommendationRepository.findById(id);
    }

    public List<Recommendation> getMostCommentedRecommendations() {
        return recommendationRepository.findMostCommentedRecommendations();
    }

    public List<RecommendationDTO> getRecommendationsFromFollowedUsers(Integer userId) {
        List<Recommendation> recommendations = recommendationRepository
                .findRecommendationsFromFollowedUsersOrderByCreatedAtDesc(userId);
        return recommendations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RecommendationDTO convertToDTO(Recommendation recommendation) {
        RecommendationDTO dto = new RecommendationDTO();
        dto.setId(recommendation.getId());
        dto.setContent(recommendation.getContent());
        dto.setCreatedAt(recommendation.getCreatedAt());

        // Set movie data
        MovieDTO movieDTO = new MovieDTO();
        movieDTO.setId(recommendation.getMovie().getId());
        movieDTO.setTitle(recommendation.getMovie().getTitle());
        movieDTO.setPoster(recommendation.getMovie().getPoster());
        movieDTO.setDescription(recommendation.getMovie().getDescription());
        movieDTO.setGenres(recommendation.getMovie().getGenres());
        dto.setMovie(movieDTO);

        // Set user data
        UserDTO userDTO = new UserDTO();
        userDTO.setId(recommendation.getUser().getId());
        userDTO.setUsername(recommendation.getUser().getUsername());
        userDTO.setForename(recommendation.getUser().getForename());
        userDTO.setSurename(recommendation.getUser().getSurename());
        dto.setUser(userDTO);

        // Set comment count
        dto.setCommentCount(recommendation.getComments() != null ? recommendation.getComments().size() : 0);

        return dto;
    }
}