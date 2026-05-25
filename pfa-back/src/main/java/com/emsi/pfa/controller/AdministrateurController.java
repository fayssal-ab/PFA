package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.emsi.pfa.service.AdministrateurService;

@RestController
@RequestMapping("/administrateurs")
public class AdministrateurController {
    @Autowired
        private AdministrateurService service;
}
