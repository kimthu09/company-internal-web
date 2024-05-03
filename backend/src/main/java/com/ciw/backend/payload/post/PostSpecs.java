package com.ciw.backend.payload.post;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Post;
import com.ciw.backend.exception.AppException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class PostSpecs {
	public static Specification<Post> hasTitle(String title) {
		return (root, query, cb) -> cb.like(root.get("title"), "%" + title + "%");
	}

	public static Specification<Post> hasTag(List<String> tags) {
		return (root, query, cb) -> root.join("tags").get("id").in(tags);
	}

	public static Specification<Post> isUpdatedAfter(String updatedAtFromDate) {
		LocalDateTime updatedAtFrom;
		try {
			updatedAtFrom = LocalDateTime.parse(updatedAtFromDate,
												DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		} catch (Exception e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.TIME_INVALID_FORMAT_DD_MM_YYYY);
		}
		return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("updatedAt"), updatedAtFrom);
	}

	public static Specification<Post> isUpdatedBefore(String updatedAtToDate) {
		LocalDateTime updatedAtTo;
		try {
			updatedAtTo = LocalDateTime.parse(updatedAtToDate,
											  DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		} catch (Exception e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.TIME_INVALID_FORMAT_DD_MM_YYYY);
		}

		return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("updatedAt"), updatedAtTo);
	}
}
