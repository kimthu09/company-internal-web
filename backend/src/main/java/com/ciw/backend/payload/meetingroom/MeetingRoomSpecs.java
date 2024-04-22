package com.ciw.backend.payload.meetingroom;

import com.ciw.backend.entity.MeetingRoom;
import org.springframework.data.jpa.domain.Specification;

public class MeetingRoomSpecs {
	public static Specification<MeetingRoom> hasName(String name) {
		return (root, query, cb) -> cb.like(root.get("name"), "%" + name + "%");
	}

	public static Specification<MeetingRoom> hasLocation(String location) {
		return (root, query, cb) -> cb.like(root.get("location"), "%" + location + "%");
	}
}