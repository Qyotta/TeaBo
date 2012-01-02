package de.bht.swp.lao.ocp.note;

import javax.persistence.Entity;

import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

@Entity
public class Note extends WhiteboardItem{

	private String text;
	
	public Note(){}
	
	
	public String getText() {
		return text;
	}
	
	public void setText(String text) {
		this.text = text;
	}
	
}
