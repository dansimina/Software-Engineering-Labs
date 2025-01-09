package com.example.demo.presentation;

import com.example.demo.business.logic.MovieService;
import com.example.demo.dto.MovieDTO;
import com.example.demo.model.Movie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/movies")  // Added leading forward slash
public class MovieController {
    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<List<MovieDTO>> getAllMovies() {
        List<Movie> movies = movieService.findAll();
        List<MovieDTO> movieDTOs = movies.stream()
                .map(this::convertToFullDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(movieDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> getMovieById(@PathVariable Integer id) {
        Optional<Movie> movieOptional = movieService.findById(id);
        return movieOptional
                .map(movie -> ResponseEntity.ok(convertToFullDTO(movie)))
                .orElse(ResponseEntity.notFound().build());
    }

    private MovieDTO convertToFullDTO(Movie movie) {
        MovieDTO dto = new MovieDTO();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setPoster(movie.getPoster());
        dto.setDescription(movie.getDescription());
        dto.setReleaseYear(movie.getReleaseYear());
        dto.setGenres(movie.getGenres());
        dto.setRuntime(movie.getRuntime());
        dto.setStars(movie.getStars());
        dto.setDirector(movie.getDirector());
        dto.setTrailer(movie.getTrailer());
        return dto;
    }

    @PostMapping("/create")
    public ResponseEntity<MovieDTO> createMovie(@RequestBody MovieDTO movieDTO) {
        try {
            // Convert DTO to entity
            Movie movie = new Movie();
            movie.setTitle(movieDTO.getTitle());
            movie.setDescription(movieDTO.getDescription());
            movie.setReleaseYear(movieDTO.getReleaseYear());
            movie.setGenres(movieDTO.getGenres());
            movie.setRuntime(movieDTO.getRuntime());
            movie.setStars(movieDTO.getStars());
            movie.setDirector(movieDTO.getDirector());
            movie.setTrailer(movieDTO.getTrailer());
            movie.setPoster(movieDTO.getPoster()); // This will be the base64 string

            // Save the movie
            Movie savedMovie = movieService.save(movie);

            // Convert back to DTO and return
            return ResponseEntity.ok(convertToFullDTO(savedMovie));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}