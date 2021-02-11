package com.ugomes.webchat.models;

import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;

@Entity
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User userOrigin;

    @ManyToOne(fetch = FetchType.LAZY)
    private User userDestiny;

    private String msg;
    private Date timestamp;

}
