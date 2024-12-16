package com.example.demo.business.logic;

import com.example.demo.data.access.FollowedUserRepository;
import com.example.demo.data.access.UserRepository;
import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.FollowedUser;
import com.example.demo.model.LoginResponse;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final FollowedUserRepository followedUserRepository;

    @Transactional
    public String save(UserDTO userDTO) {
        // Check if username already exists
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Convert DTO to entity
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword()); // In production, use password encoder
        user.setEmail(userDTO.getEmail());
        user.setSurename(userDTO.getSurename());
        user.setForename(userDTO.getForename());
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : "USER"); // Default role
        user.setDescription(userDTO.getDescription());
        user.setRegistrationDate(LocalDate.now());

        // Initialize collections
        user.setRecommendations(new ArrayList<>());
        user.setComments(new ArrayList<>());
        user.setFollowing(new ArrayList<>());
        user.setFollowers(new ArrayList<>());

        // Save the user
        User savedUser = userRepository.save(user);

        // Return the ID of saved user
        return savedUser.getId().toString();
    }

    public UserService(UserRepository userRepository, FollowedUserRepository followedUserRepository) {
        this.userRepository = userRepository;
        this.followedUserRepository = followedUserRepository;
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        System.out.println(username);
        return userRepository.findByUsername(username);
    }

    public User save(User user) {
        if (user.getRegistrationDate() == null) {
            user.setRegistrationDate(LocalDate.now());
        }
        return userRepository.save(user);
    }

    public List<User> findMostActiveUsers() {
        return userRepository.findMostActiveUsers();
    }

    @Transactional
    public void followUser(Integer followerId, Integer followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));

        if (!followedUserRepository.isFollowing(followerId, followedId)) {
            FollowedUser followedUser = new FollowedUser();
            followedUser.setFollower(follower);
            followedUser.setFollowed(followed);
            followedUser.setCreatedAt(LocalDate.now());
            followedUserRepository.save(followedUser);
        }
    }

    public List<User> getFollowers(Integer userId) {
        return userRepository.findFollowersByUserId(userId);
    }

    public List<User> getFollowing(Integer userId) {
        return userRepository.findFollowedUsersByUserId(userId);
    }

    public LoginResponse loginUser(LoginDTO loginDTO) {
        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // In a real application, you should use a password encoder
        if (user.getPassword().equals(loginDTO.getPassword())) {
            UserDTO userDTO = convertToDTO(user);
            return new LoginResponse("Login Success", true, userDTO);
        }

        return new LoginResponse("Login Failed", false, null);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                null, // Don't send password back
                user.getEmail(),
                user.getSurename(),
                user.getForename(),
                user.getRole(),
                user.getDescription(),
                user.getRegistrationDate(),
                user.getRecommendations(),
                user.getComments(),
                user.getFollowing(),
                user.getFollowers()
        );
    }
}