package com.projects.backend.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.projects.backend.model.User;
import com.projects.backend.model.UserPrincipal;
import com.projects.backend.repository.UserRepository;


@Service
public class UserDetailService implements UserDetailsService {

    private final UserRepository userRepository;
    
    public UserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            System.out.println("User Not Found");
            throw new UsernameNotFoundException("user not found");
        }
        return new UserPrincipal(user);
    }
}
