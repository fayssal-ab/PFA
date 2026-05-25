package com.emsi.pfa.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.emsi.pfa.repository.HistoriqueRepository;

@Service
public class HistoriqueService {
    @Autowired
        private HistoriqueRepository repo;
}
