package com.ciw.backend.repository;

import com.ciw.backend.entity.User;
import com.ciw.backend.payload.user.UserSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	Optional<User> findByEmail(String email);

	@Query("SELECT u FROM User u WHERE u.unit.id = :unitId AND u.isDeleted <> true")
	List<User> findByUnitIdAndNotDeleted(Long unitId);

	@Modifying
	@Query("UPDATE User u SET u.isDeleted = true, u.unit = null WHERE u.id = :userId")
	void deleteUserById(Long userId);

	List<User> findByNameContains(String name);

	default Page<User> findAllNotDeletedAndNotYourself(Specification<User> specs, Pageable pageable, String email) {
		Specification<User> spec = UserSpecs.isNotDeleted()
											.and(UserSpecs.notHaveEmail(email));
		return findAll(specs.and(spec), pageable);
	}
}
