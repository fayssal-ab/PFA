package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.emsi.pfa.service.HistoriqueService;


@RestController
@RequestMapping("/historiques")
public class HistoriqueController {
    @Autowired
        private HistoriqueService service;
}
