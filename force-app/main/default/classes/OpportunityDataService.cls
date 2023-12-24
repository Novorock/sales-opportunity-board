global with sharing class OpportunityDataService {
    @AuraEnabled
    public static OpportunitiesPage getOpportunitiesPage(Integer page) {
        PaginationData paginationData = new PaginationData();        
        Integer count = Database.countQuery('SELECT COUNT() FROM Opportunity');
        paginationData.CurrentPage = page;
        paginationData.RecordsTotalCount = count;
        
        if (Math.mod(count, 10) == 0) {
            paginationData.PagesTotalAmount = count / 10;
        } else {
            paginationData.PagesTotalAmount = count / 10 + 1;
        }

        if (page < 1 || page > paginationData.PagesTotalAmount) {
            IllegalArgumentException ex = new IllegalArgumentException();
            ex.setMessage('Invalid value for page: ' + page);
            throw ex;
        }

        Integer offset = (page - 1) * 10;

        List<Opportunity> opportunities = [
            SELECT Id, Name, Amount, StageName FROM Opportunity
            LIMIT 10 OFFSET :offset
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