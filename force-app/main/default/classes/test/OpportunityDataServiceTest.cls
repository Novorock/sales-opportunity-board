@IsTest
public with sharing class OpportunityDataServiceTest {
    @TestSetup
    private static void setup() {
    	List<Opportunity> opportunities = new List<Opportunity>();
        
        for (Integer i = 0; i < 30; i++) {
        	opportunities.add(new Opportunity(
                Name='Opportunity' + i,
                StageName='Prospecting',
                Amount=100,
                CloseDate=Date.today().addDays(5)
            ));  
        }
        
        insert opportunities;

        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < opportunities.size(); i++) {
        	contacts.add(new Contact(LastName='Contact' + i));    
        }
        
        insert contacts;
        
        List<OpportunityContactRole> junctions = new List<OpportunityContactRole>();
        for (Integer i = 0; i < contacts.size(); i++) {
        	junctions.add(new OpportunityContactRole(OpportunityId=opportunities.get(i).Id, ContactId=contacts.get(i).Id));
        }
        
		insert junctions;
    }

    @IsTest
    private static void testGetOpportunitiesPage() {
        OpportunityDataService.OpportunitiesPage page = OpportunityDataService.getOpportunitiesPage(1);
        System.assertEquals(10, page.Data.size());
        System.assertEquals(1, page.PaginationData.CurrentPage);
        System.assertEquals(3, page.PaginationData.PagesTotalAmount);

        page = OpportunityDataService.getOpportunitiesPage(-5);
        System.assertEquals(1, page.PaginationData.CurrentPage);

        page = OpportunityDataService.getOpportunitiesPage(10);
        System.assertEquals(page.PaginationData.PagesTotalAmount, page.PaginationData.CurrentPage);
        System.assertEquals(10, page.Data.size());
    }

    @IsTest
    private static void testApproveOpportunity() {
        Opportunity opportunity = [SELECT Id, StageName FROM Opportunity LIMIT 1][0];
        OpportunityDataService.approveOpportunity(opportunity.Id);
        opportunity = [SELECT StageName FROM Opportunity WHERE Id=:opportunity.Id LIMIT 1][0];
        System.assertEquals('Approved', opportunity.StageName);
    }

    @IsTest
    private static void testDeleteOpportunity() {
        List<Opportunity> opportunities = [SELECT Id FROM Opportunity LIMIT 10];
        List<String> recordsIds = new List<String>();

        for (Opportunity opportunity : opportunities) {
            recordsIds.add(opportunity.Id);
        }

        OpportunityDataService.deleteOpportunities(recordsIds);

        List<Opportunity> remaining = [SELECT Id FROM Opportunity];
        System.assertEquals(20, remaining.size());
    }
}