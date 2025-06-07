package com.shreyas.Hotel.Management.System.repo;

import com.shreyas.Hotel.Management.System.entity.Booking;
import com.shreyas.Hotel.Management.System.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking,Long> {
    List<Booking> findByRoomListContaining(Room room);
}
