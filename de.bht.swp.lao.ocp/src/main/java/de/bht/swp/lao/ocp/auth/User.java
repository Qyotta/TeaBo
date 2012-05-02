package de.bht.swp.lao.ocp.auth;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import de.bht.swp.lao.ocp.user.settings.UserSettings;
import de.bht.swp.lao.ocp.whiteboard.Assignment;
import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

/**
 * This class represents a user.
 * 
 */
@Entity
@Table(name = "LAO_USER")
public class User {
    @Id
    @GeneratedValue
    private Integer id;

    private String firstname;
    private String lastname;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String position;

    @OneToMany(mappedBy = "creator", targetEntity = WhiteboardItem.class)
    private Set<WhiteboardItem> whiteboardItems;

    @OneToMany(mappedBy = "user", targetEntity = Assignment.class, fetch = FetchType.EAGER)
    private Set<Assignment> assignments;

    @OneToMany(mappedBy = "user", targetEntity = UserSettings.class, fetch = FetchType.EAGER)
    private Set<UserSettings> settings;

    public Set<UserSettings> getSettings() {
        return settings;
    }

    public void setSettings(Set<UserSettings> settings) {
        this.settings = settings;
    }

    public Set<WhiteboardItem> getWhiteboardObjects() {
        return whiteboardItems;
    }

    public void setWhiteboardObjects(Set<WhiteboardItem> notes) {
        this.whiteboardItems = notes;
    }

    public Set<Assignment> getAssignments() {
        return assignments;
    }

    public void setAssignment(Set<Assignment> assignments) {
        this.assignments = assignments;
    }

    public void addAssignment(Assignment assignment) {
        if (assignments == null) {
            assignments = new HashSet<Assignment>();
        }

        this.assignments.add(assignment);
    }

    public void removeAssignment(Assignment assignment) {
        this.assignments.remove(assignment);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;

        int hashid = 0;
        if (id == null) {
            hashid = id.hashCode();
        }
        result = prime * result + hashid;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        User other = (User) obj;
        return id.equals(other.id);
    }

}
