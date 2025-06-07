package com.shreyas.Hotel.Management.System.repo;

import com.shreyas.Hotel.Management.System.entity.Hotel;
import com.shreyas.Hotel.Management.System.entity.Image;
import com.shreyas.Hotel.Management.System.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepo extends JpaRepository<Image,Long> {
    List<Image> findAllByHotel(Hotel h);

    List<Image> findAllByRoom(Room room);
}
