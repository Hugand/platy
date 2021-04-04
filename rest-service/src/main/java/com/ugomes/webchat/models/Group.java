package com.ugomes.webchat.models;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Entity
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private Date createdAt;
    @ManyToMany
    private List<User> users;


}
