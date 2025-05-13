package com.projects.backend.service;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-expiration}")
    private long accessExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    private final StringRedisTemplate redisTemplate;
    
    public JWTService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private static final String BLACKLIST_PREFIX = "blacklist:";


     // Generate Access Token (short-lived)
     public String generateAccessToken(String username, String role) {
        return generateToken(username, role, accessExpiration);
    }

    // Generate Refresh Token (long-lived)
    public String generateRefreshToken(String username, String role) {
        return generateToken(username, role, refreshExpiration);
    }


    public String generateToken(String username, String role, Long expirationTime) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .and()
                .signWith(getKey())
                .compact();
    
    }

    // Extract username from token
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract expiration date from token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract specific claim from token
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaim(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaim(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build().parseSignedClaims(token)
                .getPayload();
    }
    

    // Check if token has expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Validate token against username and blacklist
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token) && !isTokenBlacklisted(token);
    }

    // Validate token (generic)
    public boolean validateToken(String token) {
        return !isTokenExpired(token) && !isTokenBlacklisted(token);
    }

    // Add token to blacklist
    public void blacklistToken(String token) {
        long ttl = extractExpiration(token).getTime() - System.currentTimeMillis();
        if (ttl > 0) {
            redisTemplate.opsForValue().set(BLACKLIST_PREFIX + token, "true", ttl, TimeUnit.MILLISECONDS);
        }
    }

    // Check if token is blacklisted
    public boolean isTokenBlacklisted(String token) {
        try {
            return redisTemplate.hasKey(BLACKLIST_PREFIX + token);
        } catch (Exception e) {
            System.err.println("Redis is not available: " + e.getMessage());
            return false; 
        }
    }

    public SecretKey getKey() {
        try {
            System.out.println("Loaded JWT Secret Key: '" + secretKey + "'"); // Debug log
            byte[] keyBytes = Base64.getDecoder().decode(secretKey.trim()); // Decode Base64 key
            System.out.println("Decoded Key Bytes Length: " + keyBytes.length); // Debug log
            return Keys.hmacShaKeyFor(keyBytes); // Generate HMAC-SHA key
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid JWT secret key. Ensure it is Base64-encoded.", e);
        }
    }
}
