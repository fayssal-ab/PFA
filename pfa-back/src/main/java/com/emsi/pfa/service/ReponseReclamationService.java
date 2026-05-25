package com.emsi.pfa.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.ReponseReclamation;
import com.emsi.pfa.repository.ReclamationRepository;
import com.emsi.pfa.repository.ReponseReclamationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;


@Service
public class ReponseReclamationService {
    @Autowired
        private ReponseReclamationRepository repo;
    @Autowired
        private ReclamationRepository reclamationRepository ;

        public void createReponse(ReponseReclamation reponseReclamation){
            Reclamation reclamation = reclamationRepository.findById(reponseReclamation.getReclamation().getId())
            .orElseThrow(()->new RuntimeException("reclamation pas trouvé"));
            reponseReclamation.setReclamation(reclamation);
            repo.save(reponseReclamation);
        }

        public void updateReponse(Long id, ReponseReclamation NewreponseReclamation){
            ReponseReclamation reponseReclamation = repo.findById(id)
             .orElseThrow(()-> new RuntimeException("reponse pas trouvé"));

            reponseReclamation.setReponse(NewreponseReclamation.getReponse());
            repo.save(reponseReclamation);
        }
        public void deleteReponse(Long id){
            ReponseReclamation reponseReclamation = repo.findById(id)
             .orElseThrow(()-> new RuntimeException("reponse pas trouvé"));
             repo.delete(reponseReclamation);
        }
        public Page<ReponseReclamation> getReponsesByReclamation(Long reclamationId, int page, int size){

             Pageable pageable = PageRequest.of(
                    page,
                    size
        );
        return repo.findByReclamationId(reclamationId, pageable);
        }
}
