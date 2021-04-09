package com.ugomes.webchat.Handlers;

import com.ugomes.webchat.Utils.JwtTokenUtil;
import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@Component
public class CustomAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Autowired
    private UsersRepo usersRepo;
    private String homeUrl = "http://localhost:3000/signin";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication
    ) throws IOException, ServletException {
        if (response.isCommitted()) {
            return;
        }
        DefaultOidcUser oidcUser = (DefaultOidcUser) authentication.getPrincipal();
        Map attributes = oidcUser.getAttributes();
        String uid = (String) attributes.get("sub");

        User user = usersRepo.findByUid(uid).orElse(null);

        if(user != null) {
            System.out.println(user);
            String token = JwtTokenUtil.generateToken(user);
            String redirectionUrl = UriComponentsBuilder.fromUriString(homeUrl)
                    .queryParam("auth_token", token)
                    .build().toUriString();

            logger.info("authenticated user with uid" + uid + ", setting security context");
            SecurityContextHolder.getContext().setAuthentication(authentication);

            getRedirectStrategy().sendRedirect(request, response, redirectionUrl);
        } else
            getRedirectStrategy().sendRedirect(request, response, homeUrl);
    }
}
