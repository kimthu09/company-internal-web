package com.ciw.backend.repository;

import com.ciw.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {
	List<Notification> findAllByFromUserId(Long fromUserId);

	int countUnseenNotificationsByFromUserId(Long fromUserId);

	List<Notification> findAllUnseenByFromUserId(Long fromUserId);
}
