package com.ciw.backend.utils.validation.dob;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DOBFormatValidator.class)
@Documented
public @interface ValidDOBFormat {
	String message() default "Invalid date of birth format. It must be in the format dd/MM/yyyy";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}