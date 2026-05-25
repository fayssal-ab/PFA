package com.emsi.pfa.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.emsi.pfa.model.Priority;
import com.emsi.pfa.repository.PriorityRepository;
@Service
public class PriorityService {
    @Autowired
        private PriorityRepository repo;
        
    public void CreatePriority(Priority priority){
    if(repo.existsByPriority(priority.getPriority())){
        throw new RuntimeException("priority deja exist");
    }
        repo.save(priority);
    }
  public void UpdatePriority(Long id , Priority Newpriority){
    Priority priority = repo.findById(id)
           .orElseThrow(() -> new RuntimeException("Status non trouver"));
    priority.setPriority(Newpriority.getPriority());
    repo.save(priority);
  }
  public void DeletePriority(Long id){
    Priority status = repo.findById(id)
           .orElseThrow(() -> new RuntimeException("Status non trouver"));

    repo.delete(status);

  }
  public List<Priority> getAllPriority(){
    return repo.findAll();
  }
}
