package com.example.demo.data.access;

import com.example.demo.model.FollowedUser;
import com.example.demo.model.FollowedUserId;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowedUserRepository extends JpaRepository<FollowedUser, FollowedUserId> {
    // Check if one user follows another
    @Query("SELECT COUNT(fu) > 0 FROM FollowedUser fu WHERE fu.follower.id = :followerId AND fu.followed.id = :followedId")
    boolean isFollowing(@Param("followerId") Integer followerId, @Param("followedId") Integer followedId);

    // Find all follow relationships for a user
    List<FollowedUser> findByFollowerId(Integer followerId);

    // Find all users following a specific user
    List<FollowedUser> findByFollowedId(Integer followedId);
}
