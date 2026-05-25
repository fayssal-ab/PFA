package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import com.emsi.pfa.model.Manager;
import com.emsi.pfa.service.ManagerService;


@RestController
@RequestMapping("/managers")
public class ManagerController {
    @Autowired
        private ManagerService service;

        @GetMapping("/get-managers")
        public Page<Manager> getAllManagers( @RequestParam int page, @RequestParam int size, @RequestParam(required = false) String keyword){

        return service.getAllManagers(page, size, keyword);
        }
}
