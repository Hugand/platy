package com.ugomes.webchat.Services;

import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOidcUserService extends OidcUserService {

    @Autowired
    private UsersRepo usersRepo;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        Map attributes = oidcUser.getAttributes();
        String uid = (String) attributes.get("sub");

        List<User> usersByUid = usersRepo.findByUid(uid);
        User userInfo;

        if(!usersByUid.isEmpty()) {
            userInfo = usersByUid.get(0);
        } else {
            userInfo = new User();
        }

        userInfo.setEmail((String) attributes.get("email"));
        userInfo.setUid(uid);
        userInfo.setNomeProprio((String) attributes.get("given_name"));
        userInfo.setApelido((String) attributes.get("family_name"));
        userInfo.setProfilePic((String) attributes.get("picture"));

        usersRepo.save(userInfo);
        return oidcUser;
    }

//    private void updateUser(User userInfo) {
//        User user = usersRepo.findById(userInfo.getId());
//        if(user == null) {
//            user = new User();
//        }
//        user.setEmail(userInfo.getEmail());
//        user.setImageUrl(userInfo.getImageUrl());
//        user.setName(userInfo.getName());
//        user.setUserType(UserType.google);
//        userRepository.save(user);
//    }
}
