package com.example.demo.presentation;

import com.example.demo.business.logic.UserService;
import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.LoginResponse;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("api/v1/user")
public class LoginController {
    @Autowired
    private UserService userService;

    @PostMapping(path = "/save")
    public String saveUser(@RequestBody UserDTO userDTO) {
        String id = userService.save(userDTO);
        return id;
    }

    @PostMapping(path = "/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO loginDTO) {
        LoginResponse loginResponse = userService.loginUser(loginDTO);
        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/follow")
    public ResponseEntity<?> followUser(@RequestParam Integer followerId, @RequestParam Integer followedId) {
        userService.followUser(followerId, followedId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unfollow")
    public ResponseEntity<?> unfollowUser(@RequestParam Integer followerId, @RequestParam Integer followedId) {
        userService.unfollowUser(followerId, followedId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id) {
        Optional<User> userOptional = userService.findById(id);
        if (userOptional.isPresent()) {
            UserDTO userDTO = userService.convertToDTO(userOptional.get());
            return ResponseEntity.ok(userDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Integer id, @RequestBody UserDTO userDTO) {
        try {
            UserDTO updatedUser = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}