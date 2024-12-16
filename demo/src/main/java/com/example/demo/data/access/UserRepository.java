package com.example.demo.data.access;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Find user by username
    Optional<User> findByUsername(String username);

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find users by role
    List<User> findByRole(String role);

    // Find users registered after a specific date
    List<User> findByRegistrationDateAfter(LocalDate date);

    // Custom query to find users with most recommendations
    @Query("SELECT u FROM User u ORDER BY SIZE(u.recommendations) DESC")
    List<User> findMostActiveUsers();

    // Find followers of a specific user
    @Query("SELECT fu.follower FROM FollowedUser fu WHERE fu.followed.id = :userId")
    List<User> findFollowersByUserId(@Param("userId") Integer userId);

    // Find users a specific user is following
    @Query("SELECT fu.followed FROM FollowedUser fu WHERE fu.follower.id = :userId")
    List<User> findFollowedUsersByUserId(@Param("userId") Integer userId);
}
