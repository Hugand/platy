package com.ugomes.webchat.models;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table
public class Friends {
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private User user2;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Date friendshipDate;

}
