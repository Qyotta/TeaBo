package de.bht.swp.lao.ocp.modules.attachment;

import javax.persistence.Entity;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

import de.bht.swp.lao.ocp.modules.WhiteboardItem;

@Entity
public class Attachment extends WhiteboardItem {

	private CommonsMultipartFile data;
	private String text;
	
	public CommonsMultipartFile getData() {
		return data;
	}
	
	public void setData(CommonsMultipartFile data) {
		this.data = data;
	}
	
	public String getText() {
		return text;
	}
	
	public void setText(String text) {
		this.text = text;
	}

}
