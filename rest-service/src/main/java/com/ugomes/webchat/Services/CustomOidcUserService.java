package com.ugomes.webchat.Services;

import com.ugomes.webchat.models.User;
import com.ugomes.webchat.repositories.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.Locale;
import java.util.Map;

@Service
public class CustomOidcUserService extends OidcUserService {

    @Autowired
    private UsersRepo usersRepo;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        Map attributes = oidcUser.getAttributes();
        String uid = (String) attributes.get("sub");

        User userInfo = usersRepo.findByUid(uid).orElse(null);

        if(userInfo == null) {
            userInfo = new User();
        }

//        userInfo.setProfilePic((String) attributes.get("picture"));
        userInfo.setEmail((String) attributes.get("email"));
        userInfo.setUid(uid);
        userInfo.setNomeProprio((String) attributes.get("given_name"));
        userInfo.setApelido((String) attributes.get("family_name"));
        userInfo.setUsername(userInfo.getNomeProprio().toLowerCase(Locale.ROOT) + "_" + userInfo.getUid());
        try {
            byte[] imageData = this.loadUsersDefaultProfilePic();
            userInfo.setProfilePic(imageData);
        } catch (IOException e) {
            System.err.println("Failed loading default profile pic");
            e.printStackTrace();
        }

        usersRepo.saveAll(Collections.singletonList(userInfo));
        return oidcUser;
    }

    private byte[] loadUsersDefaultProfilePic() throws IOException {
        BufferedImage bImage = ImageIO.read(new File("src/main/resources/assets/default_profile_pic.png"));
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(bImage, "png", bos );

        return bos.toByteArray();
    }
}
