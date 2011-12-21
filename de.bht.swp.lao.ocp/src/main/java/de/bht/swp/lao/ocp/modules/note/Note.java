package de.bht.swp.lao.ocp.modules.note;

import javax.persistence.Entity;

import de.bht.swp.lao.ocp.modules.WhiteboardItem;

@Entity
public class Note extends WhiteboardItem{

	private String title;
	private String text;
	
	private Boolean inProgress;

	public Note(){}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getText() {
		return text;
	}
	
	public void setText(String text) {
		this.text = text;
	}

	public void setInProgress(Boolean inProgress){
		this.inProgress = inProgress;
	}
	
	public Boolean isInProgress(){
		return this.inProgress;
	}
	
}
