package com.example.demo.presentation;

import com.example.demo.business.logic.MessageService;
import com.example.demo.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Map<String, Object> request) {
        Integer senderId = (Integer) request.get("senderId");
        Integer receiverId = (Integer) request.get("receiverId");
        String content = (String) request.get("content");

        Message message = messageService.sendMessage(senderId, receiverId, content);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/between")
    public ResponseEntity<List<Message>> getMessagesBetweenUsers(
            @RequestParam Integer userId1,
            @RequestParam Integer userId2) {
        List<Message> messages = messageService.getMessagesBetweenUsers(userId1, userId2);
        return ResponseEntity.ok(messages);
    }
}