package com.ugomes.webchat.Configs;

import com.ugomes.webchat.Handlers.CustomAuthSuccessHandler;
import com.ugomes.webchat.Services.CustomOidcUserService;
import com.ugomes.webchat.Utils.JwtAuthenticationFilter;
import org.hibernate.annotations.Cache;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    final CustomOidcUserService oidcUserService;

    final CustomAuthSuccessHandler customAuthSuccessHandler;

    @Value("${services.frontend}")
    private String frontendUrl;

    @Value("${services.rtm}")
    private String rtmUrl;

    public SecurityConfig(CustomOidcUserService oidcUserService, CustomAuthSuccessHandler customAuthSuccessHandler) {
        this.oidcUserService = oidcUserService;
        this.customAuthSuccessHandler = customAuthSuccessHandler;
    }

    @Override
    public void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors().and().csrf().disable()
            .antMatcher("/**").authorizeRequests()
            .antMatchers("/validateToken").permitAll()
            .anyRequest().authenticated()
            .and()
                .addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class)
            .oauth2Login()
                .authorizationEndpoint()
//                .baseUri("/oauth2/authorize")
//                .authorizationRequestRepository(customAuthorizationRequestRepository())
            .and()
                .successHandler(customAuthSuccessHandler);
    }

    @Bean
    public JwtAuthenticationFilter authenticationTokenFilterBean() throws Exception {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public AuthorizationRequestRepository customAuthorizationRequestRepository() {
        return new HttpSessionOAuth2AuthorizationRequestRepository();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> allowedOrigins = new ArrayList<>();
        allowedOrigins.add(frontendUrl);
        allowedOrigins.add(rtmUrl);
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
