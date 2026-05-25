package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.emsi.pfa.model.Priority;
import com.emsi.pfa.service.PriorityService;


@RestController
@RequestMapping("/priorities")
public class PriorityController {
    @Autowired
        private PriorityService service;

    @PostMapping("/create-priority")
    public String createPriority(@RequestBody Priority priority){
    service.CreatePriority(priority);
        return "priority créé avec succès";

    }   
    @PutMapping("update-priority/{id}")
    public String UpdatePriority(@PathVariable Long id, @RequestBody Priority priority) {
        service.UpdatePriority(id,priority);
            return "priority modifie avec succès";

    }

    @DeleteMapping("delete-priority/{id}")
    public String DeletePriority(@PathVariable Long id){
        service.DeletePriority(id);
            return "priority supprime avec succès";

    }
    @GetMapping("get-priority")
    public List<Priority> getAllPriority() {
        return service.getAllPriority();
    }
}
