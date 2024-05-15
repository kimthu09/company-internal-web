package com.ciw.backend.repository;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.entity.User;
import com.ciw.backend.payload.staff.StaffSpecs;
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

	@Query("SELECT u FROM User u WHERE u.isDeleted <> true")
	List<User> findAllNotDeleted();

	@Query("SELECT u FROM User u WHERE u.id <> :excludedId AND u.id IN :ids AND u.isDeleted <> true")
	List<User> findByIdInAndNotDeletedAndIdNotEqual(List<Long> ids, Long excludedId);

	@Modifying
	@Query("UPDATE User u SET u.isDeleted = true, u.unit = null WHERE u.id = :userId")
	void deleteUserById(Long userId);

	List<User> findByNameContains(String name);

	default Page<User> findAllNotDeletedAndNotAdmin(Specification<User> specs, Pageable pageable) {
		Specification<User> spec = StaffSpecs.isNotDeleted()
											 .and(StaffSpecs.notHaveEmail(ApplicationConst.ADMIN_EMAIL));
		return findAll(specs.and(spec), pageable);
	}

	default List<User> findAllNotDeletedAndHasBirthdayInMonth(int month) {
		Specification<User> spec = StaffSpecs.isNotDeleted()
											 .and(StaffSpecs.hasDOBinMonth(month));

		return findAll(spec);
	}
}
