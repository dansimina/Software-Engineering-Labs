package com.example.demo.business.logic;

import com.example.demo.data.access.MessageRepository;
import com.example.demo.data.access.UserRepository;
import com.example.demo.model.Message;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Message sendMessage(Integer senderId, Integer receiverId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }

        // Log the incoming parameters
        System.out.println("Sending message with parameters:");
        System.out.println("senderId: " + senderId);
        System.out.println("receiverId: " + receiverId);
        System.out.println("content: " + content);

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content.trim());
        message.setSentAt(LocalDateTime.now());
        message.setRead(false);

        // Log the message object before saving
        System.out.println("Message object before saving:");
        System.out.println("Content: " + message.getContent());
        System.out.println("SentAt: " + message.getSentAt());

        Message savedMessage = messageRepository.save(message);

        // Log the saved message
        System.out.println("Saved message:");
        System.out.println("ID: " + savedMessage.getId());
        System.out.println("Content: " + savedMessage.getContent());

        return savedMessage;
    }

    public List<Message> getMessagesBetweenUsers(Integer userId1, Integer userId2) {
        System.out.println("\nFetching messages between users:");
        System.out.println("userId1: " + userId1);
        System.out.println("userId2: " + userId2);

        List<Message> messages = messageRepository.findMessagesBetweenUsers(userId1, userId2);

        // Log the retrieved messages
        System.out.println("\nRetrieved messages:");
        for (Message msg : messages) {
            System.out.println("Message ID: " + msg.getId() + ", Content: " + msg.getContent());
        }

        return messages;
    }

}