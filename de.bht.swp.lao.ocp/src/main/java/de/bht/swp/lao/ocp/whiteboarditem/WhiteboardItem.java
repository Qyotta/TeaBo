package de.bht.swp.lao.ocp.whiteboarditem;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import de.bht.swp.lao.ocp.usermanagement.User;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;

/**
 * This class represents a whiteboard item.
 *
 */
@Entity
@Inheritance(strategy=InheritanceType.JOINED)
@DiscriminatorColumn(name="type", discriminatorType=DiscriminatorType.STRING)
public class WhiteboardItem {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    
    private Long x;
    private Long y;

    @OneToOne
    private WhiteboardItem prev;
    
    @OneToOne
    private WhiteboardItem next;
    
    @ManyToOne
    private User creator;
    
    @ManyToOne
    private Whiteboard whiteboard;
    
    private Boolean inProgress;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getX() {
        return x;
    }

    public void setX(Long x) {
        this.x = x;
    }

    public Long getY() {
        return y;
    }

    public void setY(Long y) {
        this.y = y;
    }

    public WhiteboardItem getPrev() {
		return prev;
	}

	public void setPrev(WhiteboardItem prev) {
		this.prev = prev;
	}

	public WhiteboardItem getNext() {
		return next;
	}

	public void setNext(WhiteboardItem next) {
		this.next = next;
	}

	public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public Whiteboard getWhiteboard() {
        return whiteboard;
    }

    public void setWhiteboard(Whiteboard whiteboard) {
        this.whiteboard = whiteboard;
    }
    
    public void setInProgress(Boolean inProgress){
        this.inProgress = inProgress;
    }
    
    public Boolean isInProgress(){
        return this.inProgress;
    }
}
