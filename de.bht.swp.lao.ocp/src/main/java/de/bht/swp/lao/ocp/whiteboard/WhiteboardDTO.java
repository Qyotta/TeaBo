package de.bht.swp.lao.ocp.whiteboard;

import java.util.HashSet;
import java.util.Set;

public class WhiteboardDTO {

    private Long id;

    private String name;

    private Set<AssignmentDTO> assignments;
    
    public WhiteboardDTO(Whiteboard w) {
        this.id = w.getId();
        this.name = w.getName();
        setAssignments(null);
        for(Assignment assignment:w.getAssignments()){
        	this.assignments.add(new AssignmentDTO(assignment));
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

	public Set<AssignmentDTO> getAssignments() {
		return assignments;
	}

	public void setAssignments(Set<AssignmentDTO> assignments) {
		if(assignments==null){
			this.assignments = new HashSet<AssignmentDTO>();
		}
		else{
			this.assignments = assignments;
		}
	}
}
