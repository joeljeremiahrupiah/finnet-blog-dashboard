package com.finnettrust.server.user;

import java.util.List;
import java.util.UUID;

/**
 * Service layer contract, kept as an interface so this module exposes a
 * clean seam other modules can depend on without knowing about JPA or the
 * database.
 */
public interface UserService {
    List<UserDto> findAll();

    /**
     * throws ResourceNotFoundException if no user exists with the given id.
     */
    UserDto findById(UUID id);
}
