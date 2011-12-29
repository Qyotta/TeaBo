package de.bht.swp.lao.ocp.whiteboarditem;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;

import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
@DiscriminatorColumn(name="type", discriminatorType=DiscriminatorType.STRING)
public abstract class WhiteboardItem implements IWhiteboardItem {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	private Integer x;
	private Integer y;
	
	@ManyToOne
	private User creator;
	
	@ManyToOne
	private Whiteboard whiteboard;

	@Override
	public Long getId() {
		return id;
	}
	@Override
	public void setId(Long id) {
		this.id = id;
	}
	@Override
	public Integer getX() {
		return x;
	}
	@Override
	public void setX(Integer x) {
		this.x = x;
	}
	@Override
	public Integer getY() {
		return y;
	}
	@Override
	public void setY(Integer y) {
		this.y = y;
	}
	@Override
	public User getCreator() {
		return creator;
	}
	@Override
	public void setCreator(User creator) {
		this.creator = creator;
	}
	@Override
	public Whiteboard getWhiteboard() {
		return whiteboard;
	}
	@Override
	public void setWhiteboard(Whiteboard whiteboard) {
		this.whiteboard = whiteboard;
	}
	
}
