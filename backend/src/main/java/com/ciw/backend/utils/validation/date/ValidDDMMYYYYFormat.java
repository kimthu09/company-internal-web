package com.ciw.backend.utils.validation.date;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DDMMYYYYFormatValidator.class)
@Documented
public @interface ValidDDMMYYYYFormat {
	String message() default "Invalid date format. It must be in the format dd/MM/yyyy";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}