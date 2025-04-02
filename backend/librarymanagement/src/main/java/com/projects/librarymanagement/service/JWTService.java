package com.projects.librarymanagement.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Service
public class JWTService {

    StringRedisTemplate redisTemplate;
    
    public JWTService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private static final String BLACKLIST_PREFIX = "blacklist:";
    private String secretKey;

    public JWTService() throws NoSuchAlgorithmException {
        // Generate a secret key using HmacSHA256
        KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
        SecretKey sk = keyGenerator.generateKey();
        this.secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
    }


    public String generateToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 60 * 60 *300))
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
        return redisTemplate.hasKey(BLACKLIST_PREFIX + token);
    }

    // Get SecretKey for signing
    public SecretKey getKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
