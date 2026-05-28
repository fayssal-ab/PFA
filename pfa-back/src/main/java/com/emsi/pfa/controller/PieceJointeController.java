package com.emsi.pfa.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.emsi.pfa.model.User;
import com.emsi.pfa.repository.AffectationRepository;
import com.emsi.pfa.repository.ReclamationRepository;
import com.emsi.pfa.repository.UserRepository;
import com.emsi.pfa.model.Affectation;
import com.emsi.pfa.model.PieceJointe;
import com.emsi.pfa.model.Reclamation;
import com.emsi.pfa.service.PieceJointeService;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import java.nio.file.Path;

@RestController
@RequestMapping("/piece-jointes")
public class PieceJointeController {
    @Autowired
        private PieceJointeService service;
    @Autowired
        private UserRepository userRepository;
    @Autowired
        private ReclamationRepository reclamationRepository;
    @Autowired
        private AffectationRepository affectationRepository;

        @PostMapping("/upload/{reclamationId}")
         public String uploadFile(@RequestParam("file") MultipartFile file, @PathVariable Long reclamationId,Authentication authentication) throws IOException {

        String email = authentication.getName();
        service.uploadFile(file, reclamationId, email);
        return "Fichier uploadé avec succès";
         }

        @GetMapping("/client/{reclamationId}")
        public Page<PieceJointe> getPiecesClient(@PathVariable Long reclamationId, @RequestParam int page,@RequestParam int size,Authentication authentication){

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));
        if(!reclamation.getClient().getId()
                .equals(user.getClient().getId())){

            throw new RuntimeException("Accès interdit");
        }

        return service.getPiecesByReclamation(reclamationId, page, size);
        }

        @GetMapping("/agent/{reclamationId}")
        public Page<PieceJointe> getPiecesAgent(@PathVariable Long reclamationId, @RequestParam int page, @RequestParam int size, Authentication authentication){

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Reclamation reclamation = reclamationRepository.findById(reclamationId)
            .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));

        Affectation affectation = affectationRepository.findByReclamationId(reclamation.getId())
            .orElseThrow(() -> new RuntimeException("Affectation introuvable"));

        if(!affectation.getAgent().getId()
            .equals(user.getAgent().getId())){

        throw new RuntimeException("Accès interdit");
        }

        return service.getPiecesByReclamation(reclamationId, page, size);
        }
        
        @GetMapping("/reclamation/{reclamationId}")
        public Page<PieceJointe> getPiecesByRole(@PathVariable Long reclamationId, @RequestParam String role, @RequestParam int page, @RequestParam int size, Authentication authentication){

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->new RuntimeException("Utilisateur introuvable"));

        String currentRole = user.getRole().getName();

        if(currentRole.equals("manager")){

            if(role.equals("manager") || role.equals("admin")){
                throw new RuntimeException("Accès interdit");
            }
        }

        if(currentRole.equals("admin")){
            return service.getPiecesByRoleAndReclamation(reclamationId, role, page, size);
        }

        return service.getPiecesByRoleAndReclamation(reclamationId, role,page, size);
    }


    @GetMapping("/reclamation/{reclamationId}/all")
    public Page<PieceJointe> getAllPieces(@PathVariable Long reclamationId, @RequestParam int page, @RequestParam int size){
        return service.getPiecesByReclamation(reclamationId,page,size);
    }


    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) throws IOException {

    Path filePath = Paths.get( "uploads").resolve(filename);
    Resource resource =new UrlResource( filePath.toUri() );
    if(!resource.exists()){
     throw new RuntimeException("Fichier introuvable");
    }
    return ResponseEntity.ok()
        .header( HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" +  resource.getFilename() + "\"")
        .body(resource);
}

}
