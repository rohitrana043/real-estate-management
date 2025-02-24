package com.realestate.user.service;

import com.realestate.user.dto.ChangePasswordDTO;
import com.realestate.user.dto.UserDTO;
import com.realestate.user.model.User;

import java.util.List;

public interface UserService {
    UserDTO getCurrentUser();
    UserDTO getUserById(Long id);
    List<UserDTO> getAllUsers();
    List<UserDTO> getUsersByRole(String role);
    UserDTO updateProfile(UserDTO userDTO); // For users updating their own profile
    UserDTO updateUser(Long id, UserDTO userDTO); // For admin updating any user
    void deleteUser(Long id);
    String changePassword(ChangePasswordDTO changePasswordDTO);

    UserDTO convertToDTO(User user);
}