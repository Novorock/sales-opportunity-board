global with sharing class OpportunityDataService {
    @AuraEnabled
    public static OpportunitiesPage getOpportunitiesPage(Integer page) {
        if (page < 1) {
            page = 1;
        }

        PaginationData paginationData = new PaginationData();        
        Integer count = Database.countQuery('SELECT COUNT() FROM Opportunity');
        paginationData.CurrentPage = page;
        paginationData.RecordsTotalCount = count;
        
        if (Math.mod(count, 10) == 0) {
            paginationData.PagesTotalAmount = count / 10;
        } else {
            paginationData.PagesTotalAmount = count / 10 + 1;
        }

        if (page > paginationData.PagesTotalAmount) {
            page = paginationData.PagesTotalAmount;
            paginationData.CurrentPage = paginationData.PagesTotalAmount;
        }

        Integer offset = (page - 1) * 10;

        List<Opportunity> opportunities = [
            SELECT Id, Name, Amount, StageName FROM Opportunity
            WHERE NOT StageName='Approved' LIMIT 10 OFFSET :offset
        ];

        List<OpportunityData> data = new List<OpportunityData>();

        for (Opportunity opp : opportunities) {
            OpportunityData oppData = new OpportunityData();
            oppData.Id = opp.Id;
            oppData.Name = opp.Name;
            oppData.Amount = opp.Amount == null ? 0 : opp.Amount;
            oppData.Stage = opp.StageName;
            data.add(oppData);
        }

        OpportunitiesPage oppPage = new OpportunitiesPage();
        oppPage.Data = data;
        oppPage.PaginationData = paginationData;

        return oppPage;
    }

    @AuraEnabled
    public static void approveOpportunity(String recordId) {
        Opportunity opportunity = [SELECT Id FROM Opportunity WHERE Id=:recordId LIMIT 1][0];
        opportunity.StageName = 'Approved';

        try {
            update opportunity;
        } catch (Exception e) {
            String errorMsg = e.getMessage().substringAfter('_EXCEPTION,');
            throw new AuraHandledException(errorMsg);
        }
    }

    @AuraEnabled
    public static void deleteOpportunities(List<String> recordsIds) {
        List<Opportunity> opportunities = [
            SELECT Id FROM Opportunity
            WHERE Id IN :recordsIds
        ];

        try {
            delete opportunities;
        } catch (Exception e) {
            String errorMsg = e.getMessage().substringAfter('_EXCEPTION,').substringBefore(':');
            throw new AuraHandledException(errorMsg);
        }
    }

    global class PaginationData {
        @AuraEnabled
        global Integer RecordsTotalCount;
        @AuraEnabled
        global Integer PagesTotalAmount;
        @AuraEnabled
        global Integer CurrentPage; 
    }

    global class OpportunityData {
        @AuraEnabled
        global Id Id;
        @AuraEnabled
        global String Name;
        @AuraEnabled
        global Decimal Amount;
        @AuraEnabled
        global String Stage;
    }

    global class OpportunitiesPage {
        @AuraEnabled
        global List<OpportunityData> Data;
        @AuraEnabled
        global PaginationData PaginationData;
    }
}