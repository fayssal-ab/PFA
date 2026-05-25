package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.emsi.pfa.model.Status;
import com.emsi.pfa.service.StatusService;

import java.util.List;



@RestController
@RequestMapping("/status")
public class StatusController {
    @Autowired
        private StatusService service;

    @PostMapping("/create-status")
    public String createStatus(@RequestBody Status status){
    service.CreateStatus(status);
        return "Status créé avec succès";

    }   
    @PutMapping("update-status/{id}")
    public String UpdateStatus(@PathVariable Long id, @RequestBody Status status) {
        service.UpdateStatus(id,status);
            return "Status modifie avec succès";

    }

    @DeleteMapping("delete-status/{id}")
    public String DeleteStatus(@PathVariable Long id){
        service.DeleteStatus(id);
            return "Status supprime avec succès";

    }
    @GetMapping("get-status")
    public List<Status> getAllStatus() {
        return service.getAllStatus();
    }
    
}
