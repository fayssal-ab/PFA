package com.emsi.pfa.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.emsi.pfa.model.Agent;
import com.emsi.pfa.repository.AgentRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import java.util.List;
@Service
public class AgentService {
    @Autowired
        private AgentRepository repo;

    public Page<Agent> getAllAgents(
        int page,
        int size,
        String keyword){

    Pageable pageable = PageRequest.of(page, size);

    if(keyword != null && !keyword.isEmpty()){

        return repo
        .findByUserNomContainingIgnoreCaseOrUserPrenomContainingIgnoreCaseOrUserEmailContainingIgnoreCase(
                keyword,
                keyword,
                keyword,
                pageable
        );
    }

    return repo.findAll(pageable);
    }
    
    public List<Agent> getAllAgents(){

     return repo.findAll();
    }
    public void updateDiponibilite(Long id, boolean disponible){
        Agent agent = repo.findById(id)
                     .orElseThrow(() -> new RuntimeException("agent n existe pas " ));
        agent.setDisponible(disponible);
    }

    
}
