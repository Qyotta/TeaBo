package de.bht.swp.lao.ocp.whiteboard;

import java.awt.Color;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import de.bht.swp.lao.ocp.auth.User;
import de.bht.swp.lao.ocp.utils.AssignmentHelper;
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
    public Whiteboard(){}
    
    public Whiteboard(String name, User owner) {
        super();
        this.name = name;
        this.assignments = getAssignments();
        Color color = AssignmentHelper.generateColor();
        this.assignments.add(new Assignment(owner, this, color, true));
    }

    @OneToMany(mappedBy = "whiteboard", cascade = CascadeType.ALL)
    private List<WhiteboardItem> whiteboardItems;

    @OneToMany(mappedBy = "whiteboard",targetEntity=Assignment.class,fetch = FetchType.EAGER)
    private Set<Assignment> assignments;

    public Set<Assignment> getAssignments() {
        if(this.assignments==null){
            this.assignments = new HashSet<Assignment>();
        }
        return assignments;
    }

    public void setAssignments(Set<Assignment> assignments) {
        this.assignments = assignments;
    }

    public List<WhiteboardItem> getWhiteboardItems() {
        return whiteboardItems;
    }

    public void setWhiteboardItems(List<WhiteboardItem> whiteboardItems) {
        this.whiteboardItems = whiteboardItems;
    }

    public Assignment getOwner() {
        for (Assignment assignment : this.assignments) {
            if (assignment.getIsOwner()) {
                return assignment;
            }
        }
        return null;
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
