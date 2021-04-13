package com.ugomes.webchat.Comparators;

import com.ugomes.webchat.models.User;

import java.util.Comparator;

public class UserFirstNameComparator implements Comparator<User> {
    @Override
    public int compare(User firstPlayer, User secondPlayer) {
        return CharSequence.compare(firstPlayer.getNomeProprio(), secondPlayer.getNomeProprio());
    }
}
