package com.shreyas.Hotel.Management.System.dao;

import com.shreyas.Hotel.Management.System.entity.Hotel;
import com.shreyas.Hotel.Management.System.entity.Image;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HotelDao {
    Hotel hotel;
    List<Image> imageList;
}
