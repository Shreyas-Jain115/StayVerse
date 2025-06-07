package com.shreyas.Hotel.Management.System.repo;

import com.shreyas.Hotel.Management.System.entity.Hotel;
import com.shreyas.Hotel.Management.System.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepo extends JpaRepository<Room, Long> {
    List<Room> findAllByHotel(Hotel h);
}
