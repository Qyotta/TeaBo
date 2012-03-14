package de.bht.swp.lao.ocp.note;

public class NoteDTO {

    private String creator;
    private Long id;
    private String text;
    private Long x;
    private Long y;
    private Long whiteboardId;

    public NoteDTO(Note note) {
        this.setCreator(note.getCreator().getEmail());
        this.setId(note.getId());
        this.setText(note.getText());
        this.setWhiteboardId(note.getWhiteboard().getId());
        this.setX(note.getX());
        this.setY(note.getY());
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getWhiteboardId() {
        return whiteboardId;
    }

    public void setWhiteboardId(Long whiteboardId) {
        this.whiteboardId = whiteboardId;
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

}
