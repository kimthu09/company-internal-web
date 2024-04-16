package com.ciw.backend.utils.converter;

import com.ciw.backend.constants.Message;
import com.ciw.backend.exception.AppException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Component
public class HashMapConverter implements AttributeConverter<Map<String, Object>, String> {
	private final ObjectMapper objectMapper;

	@Override
	public String convertToDatabaseColumn(Map<String, Object> json) {

		String jsonString = null;
		try {
			jsonString = objectMapper.writeValueAsString(json);
		} catch (final JsonProcessingException e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.JSON_ERR);
		}

		return jsonString;
	}

	@Override
	public Map<String, Object> convertToEntityAttribute(String jsonString) {

		Map<String, Object> json = null;
		try {
			json = objectMapper.readValue(jsonString,
										  new TypeReference<HashMap<String, Object>>() {
										  });
		} catch (final IOException e) {
			throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, Message.COMMON_ERR);
		}

		return json;
	}
}