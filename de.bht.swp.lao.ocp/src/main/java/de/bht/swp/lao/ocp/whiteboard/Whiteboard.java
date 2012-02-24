package de.bht.swp.lao.ocp.whiteboard;

import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import de.bht.swp.lao.ocp.auth.User;
import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

/**
 * This class represents a whiteboard.
 * 
 */
@Entity
@Table(name = "LAO_WHITEBOARD")
public class Whiteboard {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @ManyToOne
    private User creator;

    // @OneToMany(mappedBy = "whiteboard", cascade = CascadeType.ALL)
    // @JoinColumn(name = "whiteboard", insertable = true, updatable = true,
    // nullable = true)
    // @OrderColumn
    @OneToMany(mappedBy = "whiteboard", cascade = CascadeType.ALL)
    private List<WhiteboardItem> whiteboardItems;

    @ManyToMany(mappedBy = "assignedWhiteboards")
    private Set<User> assignedUsers;

    public Set<User> getAssignedUsers() {
        return assignedUsers;
    }

    public void setAssignedUsers(Set<User> assignedUsers) {
        this.assignedUsers = assignedUsers;
    }

    public List<WhiteboardItem> getWhiteboardItems() {
        return whiteboardItems;
    }

    public void setWhiteboardItems(List<WhiteboardItem> whiteboardItems) {
        this.whiteboardItems = whiteboardItems;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
