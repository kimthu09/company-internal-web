package com.ciw.backend.utils.converter;

import com.ciw.backend.constants.Message;
import com.ciw.backend.exception.AppException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.util.List;

@RequiredArgsConstructor
@Component
public class ListConverter<T> implements AttributeConverter<List<T>, String> {
	private final ObjectMapper objectMapper;

	@Override public String convertToDatabaseColumn(List<T> ts) {
		try {
			return objectMapper.writeValueAsString(ts);
		} catch (JsonProcessingException e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.JSON_ERR);
		}
	}

	@Override public List<T> convertToEntityAttribute(String string) {
		try {
			return objectMapper.readValue(string,
										  objectMapper.getTypeFactory().constructCollectionType(List.class, getType()));
		} catch (IOException e) {
			throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, Message.COMMON_ERR);
		}
	}

	@SuppressWarnings("unchecked")

	private Class<T> getType() {
		return (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
	}
}
