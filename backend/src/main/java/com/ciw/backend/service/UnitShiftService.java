package com.ciw.backend.service;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Unit;
import com.ciw.backend.entity.UnitShift;
import com.ciw.backend.entity.UnitShiftAbsent;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.MapResponseWithoutPage;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.calendar.CalendarPart;
import com.ciw.backend.payload.calendar.DayOfWeek;
import com.ciw.backend.payload.calendar.ShiftType;
import com.ciw.backend.payload.unit.UnitWithIdAndNameResponse;
import com.ciw.backend.payload.unitshift.*;
import com.ciw.backend.payload.user.SimpleUserResponse;
import com.ciw.backend.repository.UnitRepository;
import com.ciw.backend.repository.UnitShiftAbsentRepository;
import com.ciw.backend.repository.UnitShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service @RequiredArgsConstructor public class UnitShiftService {
	private final UnitShiftRepository unitShiftRepository;
	private final UnitShiftAbsentRepository unitShiftAbsentRepository;
	private final UnitRepository unitRepository;

	@Transactional public UnitShiftResponse fetchShiftByWeek(Long unitId) {
		Common.findUnitById(unitId, unitRepository);

		List<UnitShift> shifts = unitShiftRepository.findByUnitId(unitId);

		return mapToDTO(shifts);
	}

	@Transactional public MapResponseWithoutPage<UnitShiftDayResponse, UnitShiftDayFilter> fetchShiftByDay(
			UnitShiftDayFilter filter) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

		Date from;
		Date to;
		try {
			from = dateFormat.parse(filter.getFrom());
			to   = dateFormat.parse(filter.getTo());
		} catch (Exception e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Calendar.DATE_VALIDATE);
		}

		List<UnitShiftAbsent> absents = unitShiftAbsentRepository.findByDateBetween(from, to);

		List<UnitShift> shifts = unitShiftRepository.findAll();

		return MapResponseWithoutPage.<UnitShiftDayResponse, UnitShiftDayFilter>builder()
									 .data(mapToDTO(filter.getFrom(), filter.getTo(), shifts, absents))
									 .filter(filter)
									 .build();
	}

	private Map<String, UnitShiftDayResponse> mapToDTO(String from,
													   String to,
													   List<UnitShift> shifts,
													   List<UnitShiftAbsent> absents) {
		Map<String, List<UnitShift>> shiftMap = mapUnitShiftByDay(from, to, shifts);
		Map<String, List<UnitShiftAbsent>> absentMap = mapUnitShiftAbsentByDay(absents);

		Map<String, UnitShiftDayResponse> res = new HashMap<>();
		for (String s : shiftMap.keySet()) {
			res.put(s, getUnitShiftDayDetailResponse(
					shiftMap.get(s).stream().toList(),
					absentMap.getOrDefault(s, new ArrayList<>()).stream().toList()
			));
		}

		return res;
	}

	private Map<String, List<UnitShift>> mapUnitShiftByDay(String from, String to, List<UnitShift> shifts) {
		Map<DayOfWeek, List<UnitShift>> shiftMap = mapUnitShiftByDayOfWeek(shifts);

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		LocalDate start = LocalDate.parse(from, formatter);
		LocalDate end = LocalDate.parse(to, formatter);

		Map<String, List<UnitShift>> res = new HashMap<>();
		while (!start.isAfter(end)) {
			DayOfWeek dayOfWeek = DayOfWeek.valueOf(start.getDayOfWeek().toString());

			if (!shiftMap.containsKey(dayOfWeek)) {
				shiftMap.put(dayOfWeek, new ArrayList<>());
			}

			res.put(formatter.format(start), shiftMap.get(dayOfWeek));
		}

		return res;
	}

	private Map<DayOfWeek, List<UnitShift>> mapUnitShiftByDayOfWeek(List<UnitShift> shifts) {
		Map<DayOfWeek, List<UnitShift>> res = new HashMap<>();

		for (UnitShift shift : shifts) {
			if (!res.containsKey(shift.getDayOfWeek())) {
				List<UnitShift> list = new ArrayList<>();
				list.add(shift);

				res.put(shift.getDayOfWeek(), list);
			} else {
				List<UnitShift> list = res.get(shift.getDayOfWeek());
				list.add(shift);
			}
		}

		return res;
	}

	private Map<String, List<UnitShiftAbsent>> mapUnitShiftAbsentByDay(List<UnitShiftAbsent> absents) {
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

		Map<String, List<UnitShiftAbsent>> res = new HashMap<>();

		for (UnitShiftAbsent absent : absents) {
			String date = formatter.format(absent.getDate());
			if (!res.containsKey(date)) {
				List<UnitShiftAbsent> list = new ArrayList<>();
				list.add(absent);

				res.put(date, list);
			} else {
				List<UnitShiftAbsent> list = res.get(date);
				list.add(absent);
			}
		}

		return res;
	}

	private UnitShiftDayResponse getUnitShiftDayDetailResponse(List<UnitShift> shifts,
															   List<UnitShiftAbsent> absents) {
		Map<ShiftType, Map<Long, UnitShiftDayDetailResponse>> map = new HashMap<>();

		for (UnitShift shift : shifts) {
			if (shift.isHasDayShift()) {
				mappingToShiftType(map, shift, ShiftType.DAY);
			}
			if (shift.isHasNightShift()) {
				mappingToShiftType(map, shift, ShiftType.NIGHT);
			}
		}

		for (UnitShiftAbsent absent : absents) {
			mappingToShiftType(map, absent);
		}

		return UnitShiftDayResponse.builder()
								   .day(map.get(ShiftType.DAY).values().stream().toList())
								   .night(map.get(ShiftType.NIGHT).values().stream().toList())
								   .build();
	}

	private void mappingToShiftType(Map<ShiftType, Map<Long, UnitShiftDayDetailResponse>> map,
									UnitShift shift,
									ShiftType shiftType) {
		if (map.containsKey(shiftType)) {
			Map<Long, UnitShiftDayDetailResponse> shiftMap = map.get(shiftType);
			shiftMap.put(shift.getUnit().getId(),
						 UnitShiftDayDetailResponse.builder().unit(mapToDTO(shift.getUnit())).build());
		} else {
			Map<Long, UnitShiftDayDetailResponse> shiftMap = new HashMap<>();
			shiftMap.put(shift.getUnit().getId(),
						 UnitShiftDayDetailResponse.builder().unit(mapToDTO(shift.getUnit())).build());
			map.put(shiftType, shiftMap);
		}
	}

	private void mappingToShiftType(Map<ShiftType, Map<Long, UnitShiftDayDetailResponse>> map,
									UnitShiftAbsent absent) {
		if (map.containsKey(absent.getShiftType())) {
			Map<Long, UnitShiftDayDetailResponse> shiftMap = map.get(absent.getShiftType());
			if (shiftMap.containsKey(absent.getUnit().getId())) {
				UnitShiftDayDetailResponse detail = shiftMap.get(absent.getUnit().getId());
				detail.setAbsent(mapToDTO(absent));
			} else {
				UnitShiftDayDetailResponse detail = UnitShiftDayDetailResponse.builder()
																			  .unit(mapToDTO(
																					  absent.getUnit()))
																			  .absent(mapToDTO(
																					  absent))
																			  .build();
				shiftMap.put(absent.getUnit().getId(), detail);
			}
		} else {
			Map<Long, UnitShiftDayDetailResponse> shiftMap = new HashMap<>();
			UnitShiftDayDetailResponse detail = UnitShiftDayDetailResponse.builder()
																		  .unit(mapToDTO(
																				  absent.getUnit()))
																		  .absent(mapToDTO(
																				  absent))
																		  .build();
			shiftMap.put(absent.getUnit().getId(), detail);
			map.put(absent.getShiftType(), shiftMap);
		}
	}

	@Transactional public UnitShiftResponse changeShift(Long unitId, ChangeUnitShiftRequest request) {
		Unit unit = Common.findUnitById(unitId, unitRepository);

		List<UnitShift> unitShifts = new ArrayList<>();
		List<DayOfWeek> days = Arrays.stream(DayOfWeek.values()).toList();

		for (DayOfWeek day : days) {
			ChangeUnitShiftDetailRequest detail = request.getShifts()
														 .getOrDefault(day, new ChangeUnitShiftDetailRequest());
			unitShifts.add(UnitShift.builder()
									.unit(unit)
									.dayOfWeek(day)
									.isHasDayShift(detail.isHasDayShift())
									.isHasNightShift(detail.isHasNightShift())
									.build());
		}

		return mapToDTO(unitShiftRepository.saveAll(unitShifts));
	}

	@Transactional public SimpleResponse absentUnitShift(Long unitId, AbsentUnitShiftRequest request) {
		Unit unit = Common.findUnitById(unitId, unitRepository);

		List<CalendarPart> calendarParts = Common.generateCalendarPart(request.getFrom(), request.getTo());

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		List<UnitShiftAbsent> absents = calendarParts.stream().map(cp -> {
			LocalDate localDate = LocalDate.parse(cp.getDate(), formatter);
			Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

			return UnitShiftAbsent.builder().unit(unit).shiftType(cp.getShiftType()).date(date).build();
		}).toList();

		unitShiftAbsentRepository.saveAll(absents);

		return new SimpleResponse();
	}

	private UnitShiftResponse mapToDTO(List<UnitShift> shiftEntities) {
		if (shiftEntities.stream()
						 .anyMatch(shift -> !shift.getUnit().getId().equals(shiftEntities.get(0).getUnit().getId()))) {
			throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, Message.COMMON_ERR);
		}

		Map<DayOfWeek, UnitShiftDetailResponse> shifts = new HashMap<>();
		for (UnitShift shiftEntity : shiftEntities) {
			shifts.put(shiftEntity.getDayOfWeek(),
					   UnitShiftDetailResponse.builder()
											  .isHasDayShift(shiftEntity.isHasDayShift())
											  .isHasNightShift(shiftEntity.isHasNightShift())
											  .build());
		}
		return UnitShiftResponse.builder().unit(mapToDTO(shiftEntities.get(0).getUnit())).shifts(shifts).build();
	}

	private UnitWithIdAndNameResponse mapToDTO(Unit unit) {
		return UnitWithIdAndNameResponse.builder().id(unit.getId()).name(unit.getName()).build();
	}

	private UnitShiftDayDetailAbsentResponse mapToDTO(UnitShiftAbsent unitShiftAbsent) {
		return UnitShiftDayDetailAbsentResponse.builder()
											   .id(unitShiftAbsent.getId())
											   .createdBy(mapToDTO(unitShiftAbsent.getCreatedBy()))
											   .build();
	}

	private SimpleUserResponse mapToDTO(User user) {
		return SimpleUserResponse.builder()
								 .id(user.getId())
								 .name(user.getName())
								 .image(user.getImage())
								 .phone(user.getPhone())
								 .email(user.getEmail())
								 .build();
	}
}

