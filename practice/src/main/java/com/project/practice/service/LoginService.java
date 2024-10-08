package com.project.practice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.project.practice.model.Login;
import com.project.practice.repository.LoginRepository;

import java.util.List;
import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public Login createLogin(Login login) {
        login.setPassword(bCryptPasswordEncoder.encode(login.getPassword()));
        return loginRepository.save(login);
    }

    public List<Login> getAllLogins() {
        return loginRepository.findAll();
    }

    public Optional<Login> getLoginById(Long id) {
        return loginRepository.findById(id);
    }

    public void deleteLogin(Long id) {
        loginRepository.deleteById(id);
    }

    public Login findByUsername(String username) {
        return loginRepository.findByUsername(username);
    }

    public Login findByEmail(String email) {
        return loginRepository.findByEmail(email);
    }

    public boolean usernameExists(String username) {
        return loginRepository.findByUsername(username) != null;
    }

    public boolean emailExists(String email) {
        return loginRepository.findByEmail(email) != null;
    }
    public Optional<Login> updateLogin(Long id, Login login) {
        return loginRepository.findById(id).map(existingLogin -> {
            existingLogin.setUsername(login.getUsername());
            existingLogin.setEmail(login.getEmail());
            if (login.getPassword() != null && !login.getPassword().isEmpty()) {
                existingLogin.setPassword(bCryptPasswordEncoder.encode(login.getPassword()));
            }
            existingLogin.setRole(login.getRole());
            return loginRepository.save(existingLogin);
        });
    }
    
}
