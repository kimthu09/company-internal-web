package com.ciw.backend.service;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.*;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.calendar.CalendarPart;
import com.ciw.backend.payload.calendar.ShiftType;
import com.ciw.backend.payload.feature.FeatureResponse;
import com.ciw.backend.payload.post.PostAttachment;
import com.ciw.backend.repository.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

public class Common {
	public static void updateIfNotNull(String newValue, Consumer<String> setter) {
		if (newValue != null) {
			setter.accept(newValue);
		}
	}

	public static void updateIfNotNull(Boolean newValue, Consumer<Boolean> setter) {
		if (newValue != null) {
			setter.accept(newValue);
		}
	}

	public static void updateIfNotNull(Long newValue, Consumer<Long> setter) {
		if (newValue != null) {
			setter.accept(newValue);
		}
	}

	public static void updateIfNotNull(Map<String, Object> newValue, Consumer<Map<String, Object>> setter) {
		if (newValue != null) {
			setter.accept(newValue);
		}
	}

	public static void updateIfNotNull(List<PostAttachment> newValue, Consumer<List<PostAttachment>> setter) {
		if (newValue != null) {
			setter.accept(newValue);
		}
	}

	public static List<FeatureResponse> getFeatureResponse(List<Long> featureIds,
														   FeatureRepository featureRepository) {
		List<Feature> features = featureRepository.findAll();

		List<Long> currFeature = new ArrayList<>();
		List<FeatureResponse> res = new ArrayList<>();
		for (Feature feature : features) {
			boolean has = featureIds.contains(feature.getId());
			if (has) {
				currFeature.add(feature.getId());
			}
			res.add(FeatureResponse.builder()
								   .id(feature.getId())
								   .name(feature.getName())
								   .has(has).build());
		}

		for (Long id : featureIds) {
			if (!currFeature.contains(id)) {
				throw new AppException(HttpStatus.BAD_REQUEST, Message.Feature.FEATURE_NOT_EXIST);
			}
		}

		return res;
	}

	public static User findUserById(Long userId, UserRepository repository) {
		User user = repository.findById(userId)
							  .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																  Message.User.USER_NOT_EXIST));
		if (user.isDeleted()) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.User.USER_IS_DELETED);
		}

		return user;
	}

	public static User findUserByEmail(String email, UserRepository repository) {
		User user = repository.findByEmail(email)
							  .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																  Message.User.USER_NOT_EXIST));
		if (user.isDeleted()) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.User.USER_IS_DELETED);
		}

		return user;
	}

	public static Unit findUnitById(Long unitId, UnitRepository repository) {
		return repository.findById(unitId)
						 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
															 Message.Unit.UNIT_NOT_EXIST));
	}

	public static Tag findTagById(Long tagId, TagRepository repository) {
		return repository.findById(tagId)
						 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
															 Message.Tag.TAG_NOT_EXIST));
	}

	public static Post findPostById(Long postId, PostRepository repository) {
		return repository.findById(postId)
						 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
															 Message.Post.POST_NOT_EXIST));
	}

	public static MeetingRoom findMeetingRoomById(Long meetingRoomId, MeetingRoomRepository repository) {
		return repository.findById(meetingRoomId)
						 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
															 Message.MeetingRoom.MEETING_ROOM_NOT_EXIST));
	}

	public static MeetingRoomCalendar findMeetingRoomCalendarById(Long bookId,
																  MeetingRoomCalendarRepository repository) {
		return repository.findById(bookId)
						 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
															 Message.MeetingRoom.BOOK_EMPTY));
	}

	public static Resource findResourceById(Long resourceId, ResourceRepository repository) {
		return repository.findById(resourceId)
						 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
															 Message.Resource.RESOURCE_NOT_EXIST));
	}

	public static ResourceCalendar findResourceCalendarById(Long bookId,
															ResourceCalendarRepository repository) {
		return repository.findById(bookId)
						 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
															 Message.Resource.BOOK_EMPTY));
	}

	public static List<CalendarPart> generateCalendarPart(CalendarPart from, CalendarPart to) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		LocalDate start = LocalDate.parse(from.getDate(), formatter);
		LocalDate end = LocalDate.parse(to.getDate(), formatter);

		List<CalendarPart> res = new ArrayList<>();
		ShiftType[] shiftTypes = ShiftType.values();
		int shiftStartIndex = from.getShiftType().ordinal();
		int shiftEndIndex = to.getShiftType().ordinal();

		int currShiftTypeIndex = shiftStartIndex;
		LocalDate currDate = start;
		while (currDate.isBefore(end) || (currDate.equals(end) && currShiftTypeIndex <= shiftEndIndex)) {
			ShiftType currentShiftType = shiftTypes[currShiftTypeIndex];
			res.add(new CalendarPart(currDate.format(formatter), currentShiftType));

			currShiftTypeIndex = (currShiftTypeIndex + 1) % shiftTypes.length;

			if (currShiftTypeIndex == 0) {
				currDate = currDate.plusDays(1);
			}
		}

		return res;
	}
}
