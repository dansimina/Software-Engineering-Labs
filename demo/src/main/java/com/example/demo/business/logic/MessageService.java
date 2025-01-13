package com.example.demo.business.logic;

import com.example.demo.data.access.MessageRepository;
import com.example.demo.data.access.UserRepository;
import com.example.demo.dto.MessageDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.Message;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    private MessageDTO convertToDTO(Message message) {
        UserDTO senderDTO = new UserDTO(
                message.getSender().getId(),
                message.getSender().getUsername(),
                null, // Don't include password
                message.getSender().getEmail(),
                message.getSender().getSurename(),
                message.getSender().getForename(),
                message.getSender().getRole(),
                message.getSender().getDescription(),
                message.getSender().getRegistrationDate(),
                null, null, null, null // We don't need these lists for messages
        );

        UserDTO receiverDTO = new UserDTO(
                message.getReceiver().getId(),
                message.getReceiver().getUsername(),
                null,
                message.getReceiver().getEmail(),
                message.getReceiver().getSurename(),
                message.getReceiver().getForename(),
                message.getReceiver().getRole(),
                message.getReceiver().getDescription(),
                message.getReceiver().getRegistrationDate(),
                null, null, null, null
        );

        return new MessageDTO(
                message.getId(),
                senderDTO,
                receiverDTO,
                message.getContent(),
                message.getSentAt(),
                message.isRead()
        );
    }

    @Transactional
    public MessageDTO sendMessage(Integer senderId, Integer receiverId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }

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

        Message savedMessage = messageRepository.save(message);
        return convertToDTO(savedMessage);
    }

    public List<MessageDTO> getMessagesBetweenUsers(Integer userId1, Integer userId2) {
        List<Message> messages = messageRepository.findMessagesBetweenUsers(userId1, userId2);
        return messages.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}