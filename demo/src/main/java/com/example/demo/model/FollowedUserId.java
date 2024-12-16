package com.example.demo.model;

import java.io.Serializable;
import java.util.Objects;

public class FollowedUserId implements Serializable {
    private Integer follower;
    private Integer followed;

    public FollowedUserId() {
    }

    public FollowedUserId(Integer follower, Integer followed) {
        this.follower = follower;
        this.followed = followed;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FollowedUserId that = (FollowedUserId) o;
        return Objects.equals(follower, that.follower) &&
                Objects.equals(followed, that.followed);
    }

    @Override
    public int hashCode() {
        return Objects.hash(follower, followed);
    }
}
