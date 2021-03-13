package com.ugomes.webchat.models;

import javax.persistence.*;

@Entity
@Table
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;
    private String nome_proprio, apelido, username, email, profile_pic, uid;

    public User(String nomeProprio, String apelido, String username) {
        this.nome_proprio = nomeProprio;
        this.apelido = apelido;
        this.username = username;
    }

    public User(Long id, String nomeProprio, String apelido, String username) {
        this.id = id;
        this.nome_proprio = nomeProprio;
        this.apelido = apelido;
        this.username = username;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNomeProprio(String proprio) {
        this.nome_proprio = proprio;
    }

    public void setApelido(String apelido) {
        this.apelido = apelido;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public void setProfilePic(String profile_pic) {
        this.profile_pic = profile_pic;
    }

    public Long getId() {
        return id;
    }

    public String getNomeProprio() {
        return nome_proprio;
    }

    public String getApelido() {
        return apelido;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getUid() {
        return uid;
    }

    public String getProfilePic() {
        return profile_pic;
    }

    public User() { }


}
