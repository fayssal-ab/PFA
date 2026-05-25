package com.emsi.pfa.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.emsi.pfa.repository.AdministrateurRepository;

@Service
public class AdministrateurService {
    @Autowired
        private AdministrateurRepository repo;
}
