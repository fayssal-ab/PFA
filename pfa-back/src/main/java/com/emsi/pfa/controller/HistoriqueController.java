package com.emsi.pfa.controller;
import java.time.LocalDate;

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
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String action,
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) LocalDate dateDebut,
        @RequestParam(required = false) LocalDate dateFin) {

    return service.getHistorique(
            page,
            size,
            action,
            userId,
            dateDebut,
            dateFin
    );
}

    @GetMapping("/get-statistiques")
    public StatistiqueHistoriqueDTO getStatistiques() {
        return service.getStatistiques();
    }
}
