package com.shreyas.Hotel.Management.System.service;

import com.shreyas.Hotel.Management.System.dao.HotelDao;
import com.shreyas.Hotel.Management.System.dao.UserDao;
import com.shreyas.Hotel.Management.System.entity.*;
import com.shreyas.Hotel.Management.System.entity.Payment.PaymentStatus;
import com.shreyas.Hotel.Management.System.repo.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.shreyas.Hotel.Management.System.dao.RoomDao;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.print.Doc;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private DocumentRepo documentRepo;
    @Autowired
    private HotelService hotelService;
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private HotelRepo hotelRepo;

    @Autowired
    private RoomRepo roomRepo;

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private ImageRepo imageRepo;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserDao login(String email, String password) {
        User user = userRepo.findByEmail(email);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        user.setPassword(password);

        

        // Fetch all bookings for the user
        List<Booking> bookings = bookingRepo.findAll().stream()
                .filter(booking -> booking.getUser().getUserId().equals(user.getUserId()))
                .collect(Collectors.toList());

        // Fetch all payments for the user's bookings
        List<Payment> payments = bookings.stream()
                .map(paymentRepo::findByBooking)
                .collect(Collectors.toList());

        // Populate UserDao with user, bookings, and payments
        UserDao userDao = new UserDao();
        userDao.setUser(user);
        userDao.setBookingList(bookings);
        userDao.setPaymentList(payments);

        return userDao;
    }

    public User registerUser(String name, String email, String password, String phone) {
        // Check if the email already exists
        if (userRepo.existsByEmail(email)) {
            throw new RuntimeException("Email already exists!");
        }
    
        String encodedPassword = passwordEncoder.encode(password);
        // Create a new user
        User user = new User(name, email, encodedPassword, phone);
        user.setRole(User.Role.GUEST); // Default role is GUEST
        userRepo.save(user);
    
        return user;
    }

    public List<HotelDao> viewAllHotels() {
        List<Hotel> hotelList = hotelRepo.findAll();

        return hotelList.stream()
                .map(hotel -> new HotelDao(hotel, hotelService.getImageHotel(hotel.getHotelId())))
                .collect(Collectors.toList());
    }


    public List<RoomDao> viewRoomsByHotel(Long hotelId) {
        Hotel hotel = hotelRepo.findById(hotelId)
                .orElseThrow(() -> new EntityNotFoundException("Hotel not found with ID: " + hotelId));
        List<Room> rooms = roomRepo.findAllByHotel(hotel);
        return rooms.stream()
                .map(room -> new RoomDao(room, imageRepo.findAllByRoom(room)))
                .collect(Collectors.toList());
    }

    public List<RoomDao> checkAvailableRooms(Long hotelId, LocalDate checkInDate, LocalDate checkOutDate) {
        Hotel hotel = hotelRepo.findById(hotelId)
                .orElseThrow(() -> new EntityNotFoundException("Hotel not found with ID: " + hotelId));

        // Fetch all rooms in the hotel
        List<Room> rooms = roomRepo.findAllByHotel(hotel);

        // Filter rooms that are available for the given dates
        return rooms.stream()
                .filter(room -> room.getBookings().stream()
                        .noneMatch(booking -> booking.getCheckInDate().isBefore(checkOutDate) &&
                                booking.getCheckOutDate().isAfter(checkInDate)))
                .map(room -> new RoomDao(room, imageRepo.findAllByRoom(room)))
                .collect(Collectors.toList());
    }

    public Booking makeBooking(Long userId, List<Long> roomIds, LocalDate checkInDate, LocalDate checkOutDate, Payment payment,Double discount) {
        // Fetch the user
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        // Fetch the rooms
        List<Room> rooms = roomRepo.findAllById(roomIds);
        if (rooms.isEmpty()) {
            throw new RuntimeException("Invalid room IDs");
        }

        // Ensure all rooms belong to the same hotel
        Hotel hotel = rooms.get(0).getHotel();
        boolean allRoomsBelongToSameHotel = rooms.stream()
                .allMatch(room -> room.getHotel().getHotelId().equals(hotel.getHotelId()));
        if (!allRoomsBelongToSameHotel) {
            throw new RuntimeException("All rooms must belong to the same hotel");
        }

        // Check room availability
        for (Room room : rooms) {
            boolean isAvailable = room.getBookings().stream()
                    .noneMatch(booking -> booking.getCheckInDate().isBefore(checkOutDate) &&
                            booking.getCheckOutDate().isAfter(checkInDate));
            if (!isAvailable) {
                throw new RuntimeException("Room with ID " + room.getRoomId() + " is not available for the selected dates");
            }
        }

        // Create a new booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoomList(rooms);
        booking.setHotel(hotel);
        booking.setCheckInDate(checkInDate);
        booking.setCheckOutDate(checkOutDate);
        booking.setBookingStatus(Booking.BookingStatus.CONFIRMED);
        booking.setDiscount(discount);
        
        // Save the booking
        booking = bookingRepo.save(booking);

        // Link the payment to the booking
        payment.setBooking(booking);
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        paymentRepo.save(payment);

        return booking;
    }
    public String uploadFile(Long userId, MultipartFile file) {
        try {
            // Save file to the file system
            Path filePath = Paths.get(uploadDir, file.getOriginalFilename());
            Files.copy(file.getInputStream(), filePath);

            // Generate file URL
            String fileUrl = "/uploads/" + file.getOriginalFilename();

            // Save file URL in the database
            Document document = new Document();
            document.setUserId(userId);
            document.setImg(fileUrl);
            documentRepo.save(document);

            return fileUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }


    public void addOrUpdateDocument(Long userId, MultipartFile file) {
        try {
            // Save file to the file system
            Path filePath = Paths.get(uploadDir, file.getOriginalFilename()+ userId);
            Files.copy(file.getInputStream(), filePath);

            // Generate file URL
            String fileUrl = "/uploads/" + file.getOriginalFilename()+userId;

            // Save file URL in the database
            Document document = new Document();
            document.setUserId(userId);
            document.setImg(fileUrl);
            documentRepo.save(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public ResponseEntity<Resource> getDocument(Long userId) {
        Optional<Document> documentOpt = documentRepo.findById(userId);
        System.out.println(1);
        // Check if document is present
        if (documentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        System.out.println(2);

        Document document = documentOpt.get(); // Extracting the Document object

        try {
            // Construct the file path
            Path filePath = Paths.get(uploadDir).resolve(document.getImg().replace("/uploads/", ""));
            System.out.println(filePath.toUri());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Serve the file as an inline resource
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            throw new RuntimeException("Failed to load file", e);
        }
    }

    public void updateBookingStatus(Long bookingId, Booking.BookingStatus status) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with ID: " + bookingId));
        booking.setBookingStatus(status);
        bookingRepo.save(booking);
    }
}
