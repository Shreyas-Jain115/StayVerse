package com.shreyas.Hotel.Management.System.dao;

import com.shreyas.Hotel.Management.System.entity.Booking;
import com.shreyas.Hotel.Management.System.entity.Hotel;
import com.shreyas.Hotel.Management.System.entity.Payment;
import com.shreyas.Hotel.Management.System.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.springframework.stereotype.Component;

import java.util.List;
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Component
public class UserDao {
    User user;
    List<Booking> bookingList;
    List<Payment> paymentList;

}
