package de.bht.swp.lao.ocp.attachment;

public class AttachmentDTO {

    private Long id;
    private String creator;
    private String description;
    private String filename;

    public AttachmentDTO(Attachment attachment) {
        this.setId(attachment.getId());
        this.setCreator(attachment.getCreator().getEmail());
        this.setDescription(attachment.getShortDescription());
        this.setFilename(attachment.getFilename());
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

}
