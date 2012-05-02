package de.bht.swp.lao.ocp.whiteboard;

public class WhiteboardDTO {

    private String creator;

    private Long id;

    private String name;

    public WhiteboardDTO(Whiteboard w) {
        this.id = w.getId();
        this.name = w.getName();
        this.creator = w.getOwner().getUser().getEmail();
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
