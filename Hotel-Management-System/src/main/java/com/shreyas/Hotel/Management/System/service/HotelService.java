package com.shreyas.Hotel.Management.System.service;

import com.shreyas.Hotel.Management.System.dao.HotelDao;
import com.shreyas.Hotel.Management.System.dao.ManagerDao;
import com.shreyas.Hotel.Management.System.dao.ManagerDashboardDto;
import com.shreyas.Hotel.Management.System.dao.RoomDao;
import com.shreyas.Hotel.Management.System.entity.*;
import com.shreyas.Hotel.Management.System.repo.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class HotelService {
    @Autowired
    UserRepo userRepo;
    @Autowired
    HotelRepo hotelRepo;
    @Autowired
    ManagerDao managerDao;
    @Autowired
    RoomRepo roomRepo;
    @Autowired
    BookingRepo bookingRepo;
    @Autowired
    ImageRepo imageRepo;
    @Autowired
    PaymentRepo paymentRepo;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void setup(User u) {
        managerDao.setUser(u);
        Hotel h=hotelRepo.findByManager(u);
        if (h == null) throw new RuntimeException("Hotel not found for manager");
        List<Image> imageList=imageRepo.findAllByHotel(h);
        HotelDao hotelDao=new HotelDao(h,imageList);
        managerDao.setHotelDao(hotelDao);
        List<Room> roomList=roomRepo.findAllByHotel(h);
        List<RoomDao> roomDaoList=new ArrayList<>();
        for(Room room:roomList) {
            List<Image> imageList1=imageRepo.findAllByRoom(room);
            roomDaoList.add(new RoomDao(room,imageList1));
        }
        managerDao.setRoomDaoList(roomDaoList);
        List<Booking> bookingList = roomList.stream()
                .flatMap(room -> bookingRepo.findByRoomListContaining(room).stream())
                .collect(Collectors.toList());

        managerDao.setBookingList(bookingList);

        List<Payment> paymentList = bookingList.stream()
                .map(paymentRepo::findByBooking)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        managerDao.setPaymentList(paymentList);
    }
    public ManagerDashboardDto login(String email,String password) {
        User u=userRepo.findByEmail(email);
        if(u != null && passwordEncoder.matches(password, u.getPassword()) && u.getRole()==User.Role.MANAGER) {
            setup(u);
            u.setPassword(password);
            ManagerDashboardDto dto = new ManagerDashboardDto(
                    managerDao.getUser(),
                    managerDao.getHotelDao(),
                    managerDao.getRoomDaoList(),
                    managerDao.getBookingList(),
                    managerDao.getPaymentList()
            );
            System.out.println(dto);
            return dto;
        }
        return null;
    }
    public User register(String name, String email, String password, String phone,String Hname, String location, String description) {
        if (userRepo.existsByEmail(email)) {
            throw new RuntimeException("Email already exists!");
        }
        String encodedPassword = passwordEncoder.encode(password);
        User user=new User(name,email,encodedPassword,phone);
        userRepo.save(user);
        user.setRole(User.Role.MANAGER);
        Hotel hotel=new Hotel(user,Hname,location,description,phone);
        hotelRepo.save(hotel);
        return user;
    }
    public Room addRoom(String roomType,Double pricePerNight,int capacity) {
        Room room=new Room(managerDao.getHotelDao().getHotel(), roomType,pricePerNight,capacity);
        RoomDao roomDao=new RoomDao(room,new ArrayList<>());
        managerDao.getRoomDaoList().add(roomDao);
        return roomRepo.save(room);
    }

    public Room changeRoom(Room room) {
        Room existingRoom = roomRepo.findById(room.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Room not found"));
        if(room.getAvailabilityStatus()!=null)
            existingRoom.setAvailabilityStatus(room.getAvailabilityStatus());
        if(room.getRoomType()!=null)
            existingRoom.setRoomType(room.getRoomType());
        if(room.getCapacity()<=0)
            existingRoom.setCapacity(room.getCapacity());
        if(room.getPricePerNight()!=null)
            existingRoom.setPricePerNight(room.getPricePerNight());
        Room updatedRoom = roomRepo.save(existingRoom);
        List<Room> roomList=roomRepo.findAllByHotel(managerDao.getHotelDao().getHotel());
        List<RoomDao> roomDaoList=roomList.stream().map(r->new RoomDao(r,imageRepo.findAllByRoom(r))).collect(Collectors.toList());
        managerDao.setRoomDaoList(roomDaoList); // refresh
        return updatedRoom;
    }
    public Image addImage(Image image,Long roomId) {
        Room r=roomRepo.findById(roomId).orElseThrow();
        image.setRoom(r);
        System.out.println(image.getRoom()+":"+image.getImg());

        return imageRepo.save(image);
    }

    public void removeImage(Long id) {
         imageRepo.deleteById(id);
    }

    public Image addImageHotel(Image image,Long hotelId) {
        if(image.getImg()==null)
            return null;
        System.out.println(image.getImg());
        Hotel r=hotelRepo.findById(hotelId).orElseThrow();
        image.setHotel(r);

        return imageRepo.save(image);
    }

    public List<Image> getImageHotel(Long hotelId) {
        Hotel h=hotelRepo.findById(hotelId).orElseThrow();
        return imageRepo.findAllByHotel(h);
    }

    public void removeImageHotel(Long id) {
        imageRepo.deleteById(id);
    }
}
