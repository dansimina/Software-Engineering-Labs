package com.example.demo.business.logic;

import com.example.demo.data.access.FollowedUserRepository;
import com.example.demo.data.access.UserRepository;
import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public List<User> getFollowers(Integer userId) {
        return userRepository.findFollowersByUserId(userId);
    }

    public List<User> getFollowing(Integer userId) {
        return userRepository.findFollowedUsersByUserId(userId);
    }

    public LoginResponse loginUser(LoginDTO loginDTO) {
        System.out.println("Attempting login with username: " + loginDTO.getUsername());

        Optional<User> userOptional = userRepository.findByUsername(loginDTO.getUsername());
        System.out.println("User found in database: " + userOptional.isPresent());

        if (userOptional.isEmpty()) {
            return new LoginResponse("Invalid username or password", false, null);
        }

        User user = userOptional.get();
        System.out.println("Retrieved password: " + user.getPassword());
        System.out.println("Provided password: " + loginDTO.getPassword());

        if (user.getPassword().equals(loginDTO.getPassword())) {
            try {
                System.out.println("Passwords match, converting to DTO");
                UserDTO userDTO = convertToDTO(user);
                System.out.println("DTO conversion successful: " + userDTO);
                return new LoginResponse("Login Success", true, userDTO);
            } catch (Exception e) {
                System.out.println("Error during DTO conversion: " + e.getMessage());
                e.printStackTrace();
                return new LoginResponse("An error occurred", false, null);
            }
        }

        return new LoginResponse("Invalid username or password", false, null);
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void followUser(Integer followerId, Integer followedId) {
        if (followerId.equals(followedId)) {
            throw new RuntimeException("Users cannot follow themselves");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower user not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));

        if (followedUserRepository.isFollowing(followerId, followedId)) {
            throw new RuntimeException("Already following this user");
        }

        FollowedUser followedUser = new FollowedUser();
        followedUser.setFollower(follower);
        followedUser.setFollowed(followed);
        followedUser.setCreatedAt(LocalDate.now());

        followedUserRepository.save(followedUser);
    }

    @Transactional
    public void unfollowUser(Integer followerId, Integer followedId) {
        if (followerId.equals(followedId)) {
            throw new RuntimeException("Users cannot unfollow themselves");
        }

        // Create a composite key
        FollowedUserId id = new FollowedUserId(followerId, followedId);

        if (!followedUserRepository.existsById(id)) {
            throw new RuntimeException("Follow relationship does not exist");
        }

        followedUserRepository.deleteById(id);
    }

    public UserDTO convertToDTO(User user) {
        List<Integer> recommendationIds = user.getRecommendations().stream()
                .map(Recommendation::getId)
                .collect(Collectors.toList());

        List<Integer> commentIds = user.getComments().stream()
                .map(Comment::getId)
                .collect(Collectors.toList());

        List<Integer> followingIds = user.getFollowing().stream()
                .map(fu -> fu.getFollowed().getId())
                .collect(Collectors.toList());

        List<Integer> followerIds = user.getFollowers().stream()
                .map(fu -> fu.getFollower().getId())
                .collect(Collectors.toList());

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                null, // Don't send password
                user.getEmail(),
                user.getSurename(),
                user.getForename(),
                user.getRole(),
                user.getDescription(),
                user.getRegistrationDate(),
                recommendationIds,
                commentIds,
                followingIds,
                followerIds
        );
    }

    @Transactional
    public UserDTO updateUser(Integer id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields if provided
        if (userDTO.getEmail() != null) {
            // Check if new email is already taken by another user
            Optional<User> existingUserWithEmail = userRepository.findByEmail(userDTO.getEmail());
            if (existingUserWithEmail.isPresent() && !existingUserWithEmail.get().getId().equals(id)) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(userDTO.getEmail());
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().trim().isEmpty()) {
            user.setPassword(userDTO.getPassword());
        }

        if (userDTO.getSurename() != null) {
            user.setSurename(userDTO.getSurename());
        }

        if (userDTO.getForename() != null) {
            user.setForename(userDTO.getForename());
        }

        if (userDTO.getDescription() != null) {
            user.setDescription(userDTO.getDescription());
        }

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }
}