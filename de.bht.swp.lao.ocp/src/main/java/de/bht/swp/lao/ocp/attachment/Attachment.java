package de.bht.swp.lao.ocp.attachment;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;

import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

@Entity
public class Attachment extends WhiteboardItem {
	
	@Lob
	@Column(length=16777215)
	private byte[] data;
	
	private String filename;
	
	private String shortDescription;
	
	public byte[] getData() {
		return data;
	}
	
	public void setData(byte[] data) {
		this.data = data;
	}
	
	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}
	
	public String getShortDescription() {
		return shortDescription;
	}
	
	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}
	
	public String getFileExtension(){
		return filename.substring(filename.lastIndexOf(".")+1);
	}
}
