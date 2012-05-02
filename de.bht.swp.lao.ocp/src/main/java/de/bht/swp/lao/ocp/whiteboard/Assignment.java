package de.bht.swp.lao.ocp.whiteboard;

import java.awt.Color;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import de.bht.swp.lao.ocp.auth.User;

@Entity
@Table(name = "LAO_ASSIGNMENT")
public class Assignment {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User user;
    @ManyToOne
    private Whiteboard whiteboard;
    private Boolean isOwner;
    private Color color;
    
    public Assignment(){
        this.isOwner = false;
    }
    
    public Assignment(User user, Whiteboard whiteboard, Color color,Boolean isOwner) {
        super();
        this.user = user;
        this.whiteboard = whiteboard;
        this.color = color;
        this.isOwner = isOwner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Whiteboard getWhiteboard() {
        return whiteboard;
    }

    public void setWhiteboard(Whiteboard whiteboard) {
        this.whiteboard = whiteboard;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((color == null) ? 0 : color.hashCode());
        result = prime * result + ((user == null) ? 0 : user.hashCode());
        result = prime * result
                + ((whiteboard == null) ? 0 : whiteboard.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Assignment other = (Assignment) obj;
        if (color == null) {
            if (other.color != null)
                return false;
        } else if (!color.equals(other.color))
            return false;
        if (user == null) {
            if (other.user != null)
                return false;
        } else if (!user.equals(other.user))
            return false;
        if (whiteboard == null) {
            if (other.whiteboard != null)
                return false;
        } else if (!whiteboard.equals(other.whiteboard))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Assignment [user=" + user + ", whiteboard=" + whiteboard
                + ", color=" + color + "]";
    }

    public Boolean getIsOwner() {
        return isOwner;
    }

    public void setIsOwner(Boolean isOwner) {
        this.isOwner = isOwner;
    }

}
