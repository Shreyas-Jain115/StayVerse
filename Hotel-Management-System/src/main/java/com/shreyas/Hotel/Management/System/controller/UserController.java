package com.shreyas.Hotel.Management.System.controller;

import com.shreyas.Hotel.Management.System.dao.HotelDao;
import com.shreyas.Hotel.Management.System.dao.Register;
import com.shreyas.Hotel.Management.System.dao.UserDao;
import com.shreyas.Hotel.Management.System.entity.*;
import com.shreyas.Hotel.Management.System.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.shreyas.Hotel.Management.System.dao.RoomDao;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public UserDao login(@RequestParam String email, @RequestParam String password) {
        return userService.login(email, password);
    }
    @PostMapping("/register")
    public User registerUser(@RequestBody Register register) {
        return userService.registerUser(
            register.getName(),
            register.getEmail(),
            register.getPassword(),
            register.getPhone()
        );
    }

    @GetMapping("/hotels")
    public List<HotelDao> viewAllHotels() {
        return userService.viewAllHotels();
    }

    @GetMapping("/hotels/{hotelId}/rooms")
    public List<RoomDao> viewRoomsByHotel(@PathVariable Long hotelId) {
        return userService.viewRoomsByHotel(hotelId);
    }

    @GetMapping("/rooms/available")
    public List<RoomDao> checkAvailableRooms(
            @RequestParam Long hotelId,
            @RequestParam String checkInDate,
            @RequestParam String checkOutDate) {
        LocalDate checkIn = LocalDate.parse(checkInDate);
        LocalDate checkOut = LocalDate.parse(checkOutDate);
        return userService.checkAvailableRooms(hotelId, checkIn, checkOut);
    }

    @PostMapping("/booking")
    public Booking makeBooking(
            @RequestParam Long userId,
            @RequestParam List<Long> roomIds,
            @RequestParam String checkInDate,
            @RequestParam String checkOutDate,
            @RequestParam Double discount,
            @RequestBody Payment payment) {
        LocalDate checkIn = LocalDate.parse(checkInDate);
        LocalDate checkOut = LocalDate.parse(checkOutDate);
        return userService.makeBooking(userId, roomIds, checkIn, checkOut, payment,discount);
    }

    @PutMapping("/booking/{bookingId}/checkIn")
    public void checkInBooking(@PathVariable Long bookingId) {
        userService.updateBookingStatus(bookingId, Booking.BookingStatus.CHECKED_IN);
    }

    @PutMapping("/booking/{bookingId}/checkOut")
    public void checkOutBooking(@PathVariable Long bookingId) {
        userService.updateBookingStatus(bookingId, Booking.BookingStatus.CHECKED_OUT);
    }

    @PostMapping("/addOrUpdate")
    public void addOrUpdateDocument(
            @RequestParam("userId") Long userId,
            @RequestParam("file") MultipartFile file) {
        userService.addOrUpdateDocument(userId, (file));
    }
    @GetMapping("/getDocument")
    public ResponseEntity<Resource> getDocument(@RequestParam("userId") Long userId) {
        return userService.getDocument(userId);
    }
}
