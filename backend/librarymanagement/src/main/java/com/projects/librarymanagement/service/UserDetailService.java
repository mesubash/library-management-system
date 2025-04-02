package com.projects.librarymanagement.service;

import com.projects.librarymanagement.model.User;
import com.projects.librarymanagement.model.UserPrincipal;
import com.projects.librarymanagement.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class UserDetailService implements UserDetailsService {

    private UserRepository userRepository;
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
