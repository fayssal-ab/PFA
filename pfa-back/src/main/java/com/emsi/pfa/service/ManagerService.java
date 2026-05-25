package com.emsi.pfa.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.emsi.pfa.repository.ManagerRepository;
import com.emsi.pfa.model.Manager;
@Service
public class ManagerService {
    @Autowired
        private ManagerRepository repo;

    public Page<Manager> getAllManagers(int page,int size,String keyword){

    Pageable pageable = PageRequest.of(page, size);

    if(keyword != null && !keyword.isEmpty()){

        return repo.findByUserNomContainingIgnoreCaseOrUserPrenomContainingIgnoreCaseOrUserEmailContainingIgnoreCase(
                keyword,
                keyword,
                keyword,
                pageable
        );
    }

    return repo.findAll(pageable);
    }
}
