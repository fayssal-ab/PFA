package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.emsi.pfa.model.Historique;
import com.emsi.pfa.service.HistoriqueService;

import org.springframework.data.domain.Page;

import com.emsi.pfa.dto.StatistiqueHistoriqueDTO;


@RestController
@RequestMapping("/historiques")
public class HistoriqueController {
    @Autowired
        private HistoriqueService service;

    @GetMapping("/get-historiques")
    public Page<Historique> getHistoriques(
            @RequestParam int page,
            @RequestParam int size) {

        return service.getHistorique(page, size);
    }

    @GetMapping("/get-statistiques")
    public StatistiqueHistoriqueDTO getStatistiques() {
        return service.getStatistiques();
    }
}
