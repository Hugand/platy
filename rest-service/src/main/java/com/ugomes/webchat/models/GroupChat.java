package com.ugomes.webchat.models;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "group_chat")
public class GroupChat {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Date sentAt;
    @ManyToOne(fetch = FetchType.LAZY)
    private User userOrigin;
    @ManyToOne(fetch = FetchType.LAZY)
    private Group group;
}
