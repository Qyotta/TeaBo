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

import de.bht.swp.lao.ocp.usermanagement.User;
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

    @ManyToOne
    private User creator;

    public List<WhiteboardItem> getWhiteboardObjects() {
        return whiteboardItems;
    }

    public void setWhiteboardObjects(List<WhiteboardItem> notes) {
        this.whiteboardItems = notes;
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
