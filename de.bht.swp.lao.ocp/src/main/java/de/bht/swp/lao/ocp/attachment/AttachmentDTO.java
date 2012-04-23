package de.bht.swp.lao.ocp.attachment;

public class AttachmentDTO {

    private Long id;
    private String creator;
    private String description;
    private String filename;
    private Long x;
    private Long y;
    private Long whiteboardId;
    private Boolean complete;
    
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

	public Long getWhiteboardId() {
		return whiteboardId;
	}

	public void setWhiteboardId(Long whiteboardId) {
		this.whiteboardId = whiteboardId;
	}

	public AttachmentDTO(Attachment attachment) {
        this.setId(attachment.getId());
        this.setCreator(attachment.getCreator().getEmail());
        this.setDescription(attachment.getShortDescription());
        this.setFilename(attachment.getFilename());
        this.setX(attachment.getX());
        this.setY(attachment.getY());
        this.setWhiteboardId(attachment.getWhiteboard().getId());
        this.setComplete(attachment.getUploaded());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

	public Boolean getComplete() {
		return complete;
	}

	public void setComplete(Boolean complete) {
		this.complete = complete;
	}

}
