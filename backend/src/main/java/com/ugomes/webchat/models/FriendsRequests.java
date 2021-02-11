package com.ugomes.webchat.models;

import javax.persistence.*;
import java.sql.Date;

@Entity
public class FriendsRequests {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Date requestDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private User requestOriginUser;

    @ManyToOne(fetch = FetchType.LAZY)
    private User requestDestinyUser;
}
