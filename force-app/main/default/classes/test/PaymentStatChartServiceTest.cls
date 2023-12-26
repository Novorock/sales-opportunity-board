@IsTest
public with sharing class PaymentStatChartServiceTest {
    @TestSetup
    private static void setup() {
    	List<Opportunity> opportunities = new List<Opportunity>();
        
        for (Integer i = 0; i < 3; i++) {
        	opportunities.add(new Opportunity(
                Name='Opportunity' + i,
                StageName='Prospecting',
                Amount=100,
                CloseDate=Date.today().addDays(5)
            ));  
        }
        
        insert opportunities;

        List<Payment__c> payments = new List<Payment__c> {
            new Payment__c(
                OpportunityName__c='Opportunity0',
                Amount__c=10
            ),
            new Payment__c(
                OpportunityName__c='Opportunity0',
                Amount__c=10
            ),
            new Payment__c(
                OpportunityName__c='Opportunity1',
                Amount__c=20
            ),
            new Payment__c(
                OpportunityName__c='Opportunity2',
                Amount__c=30
            )
        };

        insert payments;
    }

    @IsTest
    private static void testGetPaymentStat() {
        PaymentStatChartService.PaymentStatData data = PaymentStatChartService.getPaymentStat();
        System.assertEquals(70, data.PaidAmount);
        System.assertEquals(230, data.RemainAmount);
    }
}