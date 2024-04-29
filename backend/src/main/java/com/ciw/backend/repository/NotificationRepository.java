package com.ciw.backend.repository;

import com.ciw.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {
	@Query("SELECT n FROM Notification n WHERE n.fromUser.id = :fromUserId")
	List<Notification> findAllByFromUserId(Long fromUserId);

	@Query("SELECT COUNT(n) FROM Notification n WHERE n.fromUser.id = :fromUserId AND n.seen = false")
	int countUnseenNotificationsByFromUserId(Long fromUserId);

	@Query("SELECT n FROM Notification n WHERE n.fromUser.id = :fromUserId AND n.seen = false")
	List<Notification> findAllUnseenByFromUserId(Long fromUserId);
}
