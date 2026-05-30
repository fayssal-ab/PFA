package com.emsi.pfa.dto;

public class StatistiqueHistoriqueDTO {

    private long totalActions;
    private long actionsAujourdHui;
    private long actionsCetteSemaine;
    private long changementsStatus;
    private long reclamationsImpactees;

    public long getTotalActions() {
        return totalActions;
    }

    public void setTotalActions(long totalActions) {
        this.totalActions = totalActions;
    }

    public long getActionsAujourdHui() {
        return actionsAujourdHui;
    }

    public void setActionsAujourdHui(long actionsAujourdHui) {
        this.actionsAujourdHui = actionsAujourdHui;
    }

    public long getActionsCetteSemaine() {
        return actionsCetteSemaine;
    }

    public void setActionsCetteSemaine(long actionsCetteSemaine) {
        this.actionsCetteSemaine = actionsCetteSemaine;
    }

    public long getChangementsStatus() {
        return changementsStatus;
    }

    public void setChangementsStatus(long changementsStatus) {
        this.changementsStatus = changementsStatus;
    }

    public long getReclamationsImpactees() {
        return reclamationsImpactees;
    }

    public void setReclamationsImpactees(long reclamationsImpactees) {
        this.reclamationsImpactees = reclamationsImpactees;
    }
}