package com.example.demo.data.access;

import com.example.demo.model.Message;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    @Query("""
        SELECT DISTINCT m FROM Message m
    LEFT JOIN FETCH m.sender s
    LEFT JOIN FETCH m.receiver r
    WHERE (m.sender.id = :userId1 AND m.receiver.id = :userId2)
    OR (m.sender.id = :userId2 AND m.receiver.id = :userId1)
    ORDER BY m.sentAt ASC
    """)
    List<Message> findMessagesBetweenUsers(Integer userId1, Integer userId2);


    List<Message> findBySenderIdOrderBySentAtDesc(Integer senderId);
    List<Message> findByReceiverIdOrderBySentAtDesc(Integer receiverId);
}