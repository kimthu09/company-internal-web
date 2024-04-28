package com.ciw.backend.service;

import com.ciw.backend.entity.Notification;
import com.ciw.backend.entity.User;
import com.ciw.backend.mail.MailSender;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.notification.*;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.user.SimpleUserResponse;
import com.ciw.backend.repository.NotificationRepository;
import com.ciw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service @RequiredArgsConstructor public class NotificationService {
	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;
	private final MailSender mailSender;

	@Transactional
	public ListResponse<NotificationResponse, NotificationFilter> getNotifications(AppPageRequest page,
																				   NotificationFilter filter,
																				   boolean changeToSeen) {
		User sender = Common.findCurrUser(userRepository);

		Pageable pageable = PageRequest.of(page.getPage() - 1,
										   page.getLimit(),
										   Sort.by(Sort.Direction.DESC, "createdAt"));
		Specification<Notification> spec = filterNotifications(sender.getId(), filter);

		Page<Notification> notificationPage = notificationRepository.findAll(spec, pageable);

		List<Notification> notifications = notificationPage.getContent();

		List<NotificationResponse> data = notifications.stream().map(this::mapToDTO).toList();

		if (changeToSeen) {
			notificationRepository.saveAll(notifications.stream()
														.peek(notification -> notification.setSeen(true))
														.toList());
		}

		return ListResponse.<NotificationResponse, NotificationFilter>builder()
						   .data(data)
						   .appPageResponse(AppPageResponse.builder()
														   .index(page.getPage())
														   .limit(page.getLimit())
														   .totalPages(notificationPage.getTotalPages())
														   .totalElements(notificationPage.getTotalElements())
														   .build())
						   .filter(filter)
						   .build();
	}

	private Specification<Notification> filterNotifications(Long receiverId, NotificationFilter filter) {
		Specification<Notification> spec = NotificationSpecs.hasReceiver(receiverId.toString());
		if (filter.getSender() != null) {
			spec = NotificationSpecs.hasSender(filter.getSender());
		}
		if (filter.getFromDate() != null) {
			spec = spec.and(NotificationSpecs.isDateCreatedAfter(filter.getFromDate()));
		}
		if (filter.getToDate() != null) {
			spec = spec.and(NotificationSpecs.isDateCreatedBefore(filter.getToDate()));
		}
		return spec;
	}

	@Transactional public NumberNotificationNotSeenResponse getNumberUnseenNotification() {
		User currUser = Common.findCurrUser(userRepository);

		return NumberNotificationNotSeenResponse.builder()
												.number(notificationRepository.countUnseenNotificationsByFromUserId(
														currUser.getId()))
												.build();
	}

	@Transactional public SimpleListResponse<NotificationResponse> getUnseenNotifications() {
		User currUser = Common.findCurrUser(userRepository);
		List<Notification> notifications = notificationRepository.findAllUnseenByFromUserId(currUser.getId());

		return new SimpleListResponse<>(notifications.stream().map(this::mapToDTO).toList());
	}

	@Transactional public SimpleResponse sendNotificationForAllStaff(CreateNotificationForAllRequest request) {
		User sender = Common.findCurrUser(userRepository);

		List<User> receivers = userRepository.findAllNotDeleted();

		return sendNotification(receivers, sender, request.getTitle(), request.getDescription());
	}

	@Transactional public SimpleResponse sendNotificationForListStaff(CreateNotificationForListStaffRequest request) {
		User sender = Common.findCurrUser(userRepository);

		List<User> receivers = userRepository.findByIdInAndNotDeletedAndIdNotEqual(request.getReceivers(),
																				   sender.getId());

		return sendNotification(receivers, sender, request.getTitle(), request.getDescription());
	}

	private SimpleResponse sendNotification(List<User> receivers, User sender, String title, String description) {


		List<Notification> notifications = receivers.stream()
													.map(receiver -> Notification.builder()
																				 .title(title)
																				 .description(description)
																				 .fromUser(sender)
																				 .toUser(receiver)
																				 .seen(false)
																				 .build())
													.toList();

		notificationRepository.saveAll(notifications);

		mailSender.sendEmail(title,
							 description,
							 receivers.stream().map(User::getEmail).toList());

		return new SimpleResponse();
	}

	@Transactional public NotificationResponse seeNotification(Long notificationId) {
		Notification notification = Common.findNotificationById(notificationId, notificationRepository);
		notification.setSeen(true);
		return mapToDTO(notificationRepository.save(notification));
	}

	@Transactional public SimpleResponse seeAllNotification() {
		User user = Common.findCurrUser(userRepository);
		List<Notification> notifications = notificationRepository.findAllByFromUserId(user.getId());

		notificationRepository.saveAll(notifications.stream()
													.peek(notification -> notification.setSeen(true))
													.toList());

		return new SimpleResponse();
	}

	private NotificationResponse mapToDTO(Notification notification) {
		return NotificationResponse.builder()
								   .id(notification.getId())
								   .title(notification.getTitle())
								   .description(notification.getDescription())
								   .from(mapToDTO(notification.getFromUser()))
								   .to(mapToDTO(notification.getToUser()))
								   .seen(notification.isSeen())
								   .build();
	}

	private SimpleUserResponse mapToDTO(User user) {
		return SimpleUserResponse.builder()
								 .id(user.getId())
								 .name(user.getName())
								 .email(user.getEmail())
								 .phone(user.getPhone())
								 .image(user.getImage())
								 .build();
	}
}