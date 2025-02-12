package com.realestate.user.service;

import com.realestate.user.dto.LoginDTO;
import com.realestate.user.dto.LoginResponseDTO;
import com.realestate.user.dto.RegisterDTO;

public interface AuthService {
    LoginResponseDTO login(LoginDTO loginDTO);
    String register(RegisterDTO registerDTO);
}