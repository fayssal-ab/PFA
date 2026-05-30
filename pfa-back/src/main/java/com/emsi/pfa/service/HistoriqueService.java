package com.emsi.pfa.service;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.emsi.pfa.model.Historique;
import org.springframework.data.domain.Sort;

import com.emsi.pfa.repository.HistoriqueRepository;
import com.emsi.pfa.dto.StatistiqueHistoriqueDTO;
@Service
public class HistoriqueService {
    @Autowired
        private HistoriqueRepository repo;
   public Page<Historique> getHistorique(
        int page,
        int size,
        String action,
        Long userId,
        LocalDate dateDebut,
        LocalDate dateFin) {

    Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by("dateAction").descending()
    );

    return repo.filtrerHistorique(
            action,
            userId,
            dateDebut,
            dateFin,
            pageable
    );
}
     public StatistiqueHistoriqueDTO getStatistiques() {

        StatistiqueHistoriqueDTO dto = new StatistiqueHistoriqueDTO();

        LocalDateTime debutJour =
                LocalDate.now().atStartOfDay();

        LocalDateTime debutSemaine =
                LocalDate.now()
                        .with(DayOfWeek.MONDAY)
                        .atStartOfDay();

        dto.setTotalActions(
                repo.count());

        dto.setActionsAujourdHui(
                repo.countByDateActionAfter(
                        debutJour));

        dto.setActionsCetteSemaine(
                repo.countByDateActionAfter(
                        debutSemaine));

        dto.setChangementsStatus(
                repo.findAll()
                        .stream()
                        .filter(h ->
                                h.getAncienStatus() != null
                                        && h.getNouveauStatus() != null)
                        .count());

        dto.setReclamationsImpactees(
                repo.findAll()
                        .stream()
                        .map(h -> h.getReclamation().getId())
                        .distinct()
                        .count());

        return dto;
    }

}
