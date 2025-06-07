package com.shreyas.Hotel.Management.System.repo;

import com.shreyas.Hotel.Management.System.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepo extends JpaRepository<Document,Long> {
}
