package com.projects.backend.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


public class UserPrincipal implements UserDetails {
    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public Long getId() {
        return user.getId();
    }
    

    public String getName() {
        return user.getName();
    }
    public String getEmail() {
        return user.getEmail();
    }
    public String getPhoneNumber() {
        return user.getPhoneNumber();
    }
    public String getAddress() {
        return user.getAddress();
    }
    public String getRole() {
        return user.getRole();
    }
    public User getUser() {
        return user;
    }
    public void setPassword(String password) {
        user.setPassword(password);
    }
    public void setPhoneNumber(String phoneNumber) {
        user.setPhoneNumber(phoneNumber);
    }
    public void setAddress(String address) {
        user.setAddress(address);
    }
    public void setRole(String role) {
        user.setRole(role);
    }

}