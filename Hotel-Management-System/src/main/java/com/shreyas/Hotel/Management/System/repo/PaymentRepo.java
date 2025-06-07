package com.shreyas.Hotel.Management.System.repo;

import com.shreyas.Hotel.Management.System.entity.Booking;
import com.shreyas.Hotel.Management.System.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepo extends JpaRepository<Payment,Long> {
    Payment findByBooking(Booking booking);
}
