
package com.vitalis_backend.dto;

public class LoginResponse {

    private String message;
    private String token;
    private String name;
    private String email;

    public LoginResponse(String message, String token, String name, String email) {
        this.message = message;
        this.token = token;
        this.name = name;
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}

