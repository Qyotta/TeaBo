package de.bht.swp.lao.ocp.whiteboard;

import java.util.ArrayList;
import java.util.List;

import de.bht.swp.lao.ocp.attachment.Attachment;
import de.bht.swp.lao.ocp.attachment.AttachmentDTO;
import de.bht.swp.lao.ocp.note.Note;
import de.bht.swp.lao.ocp.note.NoteDTO;

public class WhiteboardDTO {

    private String creator;

    private Long id;

    private ArrayList<NoteDTO> notes;

    private ArrayList<AttachmentDTO> attachments;

    private String name;

    public WhiteboardDTO(Whiteboard w, List<Note> notes,
            List<Attachment> attachments) {
        this.id = w.getId();
        this.name = w.getName();
        this.creator = w.getCreator().getEmail();

        this.notes = new ArrayList<NoteDTO>();
        if (notes != null) {
            for (Note note : notes) {
                this.notes.add(new NoteDTO(note));
            }
        }
        this.attachments = new ArrayList<AttachmentDTO>();
        if (attachments != null) {
            for (Attachment attachment : attachments) {
                this.attachments.add(new AttachmentDTO(attachment));
            }
        }
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

    public ArrayList<NoteDTO> getNotes() {
        return notes;
    }

    public ArrayList<AttachmentDTO> getAttachments() {
        return attachments;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
