package com.shreyas.Hotel.Management.System.controller;

import com.shreyas.Hotel.Management.System.dao.*;
import com.shreyas.Hotel.Management.System.entity.Image;
import com.shreyas.Hotel.Management.System.entity.Room;
import com.shreyas.Hotel.Management.System.entity.User;
import com.shreyas.Hotel.Management.System.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotel")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend origin

public class HotelController {
    @Autowired
    HotelService hotelService;
    @PostMapping("/login")
    public ManagerDashboardDto login(@RequestBody Login login) {
        return hotelService.login(login.email,login.password);
    }
    @PostMapping("/register")
    public User register(@RequestBody Register register) {
        return hotelService.register(register.name,register.email, register.password, register.phone, register.Hname, register.location, register.description);
    }

    @PostMapping("/addRoom")
    public Room addRoom(@RequestBody AddRoom addRoom) {
        return hotelService.addRoom(addRoom.roomType,addRoom.pricePerNight,addRoom.capacity);
    }
    @PutMapping("/changeRoom")
    public Room changeRoom(@RequestBody Room room) {
        return hotelService.changeRoom(room);
    }

    @PostMapping("/addImage/{roomId}")
    public Image addImage(@RequestBody Image image, @PathVariable Long roomId) {
        return hotelService.addImage(image, roomId);
    }
    @DeleteMapping("/removeImage")
    public void removeImageByQuery(@RequestParam Long id) {
            hotelService.removeImage(id);
    }

    @PostMapping("/addImageHotel/{hotelId}")
    public Image addImageHotel(@RequestBody Image image, @PathVariable Long hotelId) {
        return hotelService.addImageHotel(image, hotelId);
    }
    @PostMapping("/getImageHotel/{hotelId}")
    public List<Image> getImageHotel(@PathVariable Long hotelId) {
        return hotelService.getImageHotel(hotelId);
    }
}

