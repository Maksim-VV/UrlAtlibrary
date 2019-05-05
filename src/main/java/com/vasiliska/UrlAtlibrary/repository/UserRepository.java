package com.vasiliska.UrlAtlibrary.repository;

import com.vasiliska.UrlAtlibrary.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
