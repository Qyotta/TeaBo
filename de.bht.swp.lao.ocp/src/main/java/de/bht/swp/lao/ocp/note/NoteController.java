package de.bht.swp.lao.ocp.note;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

@Controller
public class NoteController {

    private static final String WHITEBOARD_ID_NOTES = "/whiteboard/{id}/notes";
    @Inject
    private IWhiteboardItemDao<Note> noteDao;

    @RequestMapping(value = WHITEBOARD_ID_NOTES, method = RequestMethod.GET)
    public @ResponseBody
    List<NoteDTO> getNotesByWhiteboard(HttpServletRequest request,
            @PathVariable Long id) {
        List<NoteDTO> notes = new ArrayList<NoteDTO>();

        for (Note note : noteDao.findAllbyWhiteboardId(id)) {
            notes.add(new NoteDTO(note));
        }

        return notes;
    }

    public IWhiteboardItemDao<Note> getNoteDao() {
        return noteDao;
    }

    public void setNoteDao(IWhiteboardItemDao<Note> noteDao) {
        this.noteDao = noteDao;
    }

}
