package com.shreyas.Hotel.Management.System.dao;

import com.shreyas.Hotel.Management.System.entity.Image;
import com.shreyas.Hotel.Management.System.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomDao {
    Room room;
    List<Image> imageList;
}
