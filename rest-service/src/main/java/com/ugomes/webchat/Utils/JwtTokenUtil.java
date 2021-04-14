package com.ugomes.webchat.Utils;

import com.ugomes.webchat.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Date;

@Component
public class JwtTokenUtil implements Serializable {

    public static final long ACCESS_TOKEN_VALIDITY_SECONDS = 5*60*60;
    public static final String SIGNING_KEY = "ugomes11drenadoamariabardajonanaotinhaoquepornamesa";


    public String getUidFromToken(String token) {
        return (String) getClaimFromToken(token, "SUBJECT");
    }


    public Date getExpirationDateFromToken(String token) {
        return (Date) getClaimFromToken(token, "EXPIRATION");
    }

    public Object getClaimFromToken(String token, String claimsResolverString) {
        final Claims claims = getAllClaimsFromToken(token);
        switch (claimsResolverString) {
            case "SUBJECT":
                return claims.getSubject();
            case "EXPIRATION":
                return claims.getExpiration();
            default:
        }
        return null;
    }

    private Claims getAllClaimsFromToken(String token) throws MalformedJwtException {
        return Jwts.parser()
                .setSigningKey(SIGNING_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public static String generateToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getUid());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuer("https://ugomes.com")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY_SECONDS*1000))
                .signWith(SignatureAlgorithm.HS256, SIGNING_KEY)
                .compact();
    }

    public Boolean validateToken(String token, String userUid) {
        final String uid = getUidFromToken(token);
        return (uid.equals(userUid) && !isTokenExpired(token));
    }

}

