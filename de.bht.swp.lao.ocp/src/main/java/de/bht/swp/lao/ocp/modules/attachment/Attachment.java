package de.bht.swp.lao.ocp.modules.attachment;

import com.mysql.jdbc.Blob;

import de.bht.swp.lao.ocp.modules.WhiteboardObject;

public class Attachment extends WhiteboardObject {

	private Blob data;
	private String text;
	
	public Blob getData() {
		return data;
	}
	
	public void setData(Blob data) {
		this.data = data;
	}
	
	public String getText() {
		return text;
	}
	
	public void setText(String text) {
		this.text = text;
	}

}
