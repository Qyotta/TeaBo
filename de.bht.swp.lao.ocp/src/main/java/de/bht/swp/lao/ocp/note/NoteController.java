package de.bht.swp.lao.ocp.note;

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

    @Inject
    private IWhiteboardItemDao<Note> noteDao;

    @RequestMapping(value = "/whiteboard/{id}/notes", method = RequestMethod.GET)
    public @ResponseBody
    List<Note> getNotesByWhiteboard(HttpServletRequest request,
            @PathVariable Long id) {
        List<Note> notes = noteDao.findAllbyWhiteboardId(id);
        return notes;
    }

    public IWhiteboardItemDao<Note> getNoteDao() {
        return noteDao;
    }

    public void setNoteDao(IWhiteboardItemDao<Note> noteDao) {
        this.noteDao = noteDao;
    }

}
