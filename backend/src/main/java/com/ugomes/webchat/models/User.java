package com.ugomes.webchat.models;

import javax.persistence.*;
import java.util.List;

@Entity
@Table
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;
    private String proprio, apelido, username, email, uid, profile_pic;

    public User() { }
}
