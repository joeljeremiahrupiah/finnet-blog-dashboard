package com.finnettrust.server.user;

import org.mapstruct.Mapper;

/**
 * Maps User Entity to UserDto. MapStruct generates the implementation at
 * compile time.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
}