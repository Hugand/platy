package com.ugomes.webchat.Utils;

import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.UsersRepo;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.SignatureException;
import java.util.Arrays;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        String header = req.getHeader(HEADER_STRING);
        String uid = null;
        String authToken = null;
        System.out.println("'" + header + "'");
        if (header != null && header.startsWith(TOKEN_PREFIX)) {
            authToken = header.replace(TOKEN_PREFIX,"");
            try {
                uid = jwtTokenUtil.getUidFromToken(authToken);
            } catch (IllegalArgumentException e) {
                logger.error("an error occured during getting username from token", e);
            } catch (ExpiredJwtException e) {
                logger.warn("the token is expired and not valid anymore", e);
            }
        } else {
            logger.warn("couldn't find bearer string, will ignore the header");
        }
        if (uid != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            User user = usersRepo.findByUid(uid).orElse(null);

            if (user != null && jwtTokenUtil.validateToken(authToken, user)) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, null);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));

                logger.info("authenticated user with uid" + uid + ", setting security context");
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                System.out.println("Not authenticated");
            }
        } else {
            System.out.println("Not coiso");
        }

        chain.doFilter(req, res);
    }
}
