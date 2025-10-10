package com.comandei.models;

public class User {
    private int user_id;
    private String user_name;
    private String user_email;
    private String user_password;

    public User (String user_name, String user_email, String user_password) {
        this.user_name = user_name;
        this.user_email = user_email;
        this.user_password = user_password;
    }
}