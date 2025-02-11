package com.realestate.user.service;

import com.realestate.user.dto.UserDTO;
import java.util.List;

public interface UserService {
    UserDTO getCurrentUser();
    UserDTO getUserById(Long id);
    List<UserDTO> getAllUsers();
    UserDTO updateUser(UserDTO userDTO);
    void deleteUser(Long id);
}