package com.emsi.pfa.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.emsi.pfa.model.Historique;
import com.emsi.pfa.model.PieceJointe;
import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.model.User;

import com.emsi.pfa.repository.HistoriqueRepository;
import com.emsi.pfa.repository.PieceJointeRepository;
import com.emsi.pfa.repository.ReclamationRepository;
import com.emsi.pfa.repository.UserRepository;

@Service
public class PieceJointeService {

    private final String uploadDir = "uploads/";

    @Autowired
    private PieceJointeRepository repo;

    @Autowired
    private ReclamationRepository reclamationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
        private CurrentUserService currentUserService;
    @Autowired
        private HistoriqueRepository historiqueRepository;

    public void uploadFile(MultipartFile file, Long reclamationId, String email) throws IOException {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Reclamation reclamation = reclamationRepository.findById(reclamationId)
            .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));

        
        User currentUser = currentUserService.getCurrentUser();
        if(currentUser.getRole().getName().equals("agent")){
        Historique historique = new Historique();
        historique.setAction(
        "agent "+ currentUser.getNom()+" "+currentUser.getPrenom()+" a ajouter une piece jointe"
        +"au reclamation numéro #"+reclamation.getId()
        );
        historique.setReclamation(reclamation);
        historique.setUser(currentUser);
        historique.setDateAction(LocalDateTime.now());
        historiqueRepository.save(historique);
        }
        String fileName = System.currentTimeMillis()
                + "_" + file.getOriginalFilename();

        Path path = Paths.get(uploadDir + fileName);

        Files.createDirectories(path.getParent());

        Files.write(path, file.getBytes());

        PieceJointe pieceJointe = new PieceJointe();

        pieceJointe.setFichier(fileName);
        pieceJointe.setReclamation(reclamation);
        pieceJointe.setUser(user);

        repo.save(pieceJointe);
    }

    public void deletePieceJointe(Long id){
        PieceJointe pieceJointe = repo.findById(id)
                                 .orElseThrow(() -> new RuntimeException("piece jointe non trouvée"));
        repo.delete(pieceJointe);
    }
    public Page<PieceJointe> getPiecesByReclamation(
            Long reclamationId,
            int page,
            int size){

        Pageable pageable = PageRequest.of(page, size);

        return repo.findByReclamationId(reclamationId, pageable);
    }

    public Page<PieceJointe> getPiecesByRoleAndReclamation(Long reclamationId, String roleName, int page, int size){

    Pageable pageable = PageRequest.of(page, size);

    return repo.findByReclamationIdAndUserRoleName(reclamationId, roleName, pageable);
    }
}