package de.bht.swp.lao.ocp.register;

import javax.persistence.Column;

public class RegisterFormData {

    private String email;
    @Column(nullable=false)
    private String password;
    
    @Column(nullable=false)
    private String passwordvalidate;
    private String errors;
    private String firstname;
    private String lastname;
    private String position;
    
    
    public String getEmail() {
        
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getPasswordvalidate() {
        return passwordvalidate;
    }
    public void setPasswordvalidate(String passwordvalidate) {
        this.passwordvalidate = passwordvalidate;
    }
    public String getErrors() {
        return errors;
    }
    public void setErrors(String errors) {
        this.errors = errors;
    }
    public String getFirstname() {
        return firstname;
    }
    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }
    public String getLastname() {
        return lastname;
    }
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
    public String getPosition() {
        return position;
    }
    public void setPosition(String position) {
        this.position = position;
    }
}
