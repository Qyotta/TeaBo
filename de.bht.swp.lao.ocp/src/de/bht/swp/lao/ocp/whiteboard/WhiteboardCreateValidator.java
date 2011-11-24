package de.bht.swp.lao.ocp.whiteboard;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

public class WhiteboardCreateValidator implements Validator {

	@Override
	public boolean supports(Class<?> clazz) {
		return WhiteboardCreateValidator.class.equals(clazz);
	}

	@Override
	public void validate(Object obj, Errors errors) {
		CreateWhiteboardData createWhiteboardData = (CreateWhiteboardData) obj;
		
		ValidationUtils.rejectIfEmpty(errors, "name", "field.required","name field is required");
		if(createWhiteboardData.getCreator()==null){
			errors.rejectValue("errors", "unauthorized","you are not authorized, please login");
		}
	}

}
