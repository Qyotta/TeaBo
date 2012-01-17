package de.bht.swp.lao.ocp.note;

import javax.persistence.Entity;
import javax.persistence.Table;

import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

@Entity
@Table(name="lao_note")
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
