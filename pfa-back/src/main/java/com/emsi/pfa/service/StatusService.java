package com.emsi.pfa.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.emsi.pfa.model.Status;
import com.emsi.pfa.repository.StatusRepository;

@Service
public class StatusService {
    @Autowired
         private StatusRepository repo;

  public void CreateStatus(Status status){
    if(repo.existsByStatus(status.getStatus())){
        throw new RuntimeException("status deja exist");
    }
        repo.save(status);
    }
  public void UpdateStatus(Long id , Status Newstatus){
    Status status = repo.findById(id)
           .orElseThrow(() -> new RuntimeException("Status non trouver"));
    status.setStatus(Newstatus.getStatus());
    repo.save(status);
  }
  public void DeleteStatus(Long id){
    Status status = repo.findById(id)
           .orElseThrow(() -> new RuntimeException("Status non trouver"));

    repo.delete(status);

  }
  public List<Status> getAllStatus(){
    return repo.findAll();
  }
}
