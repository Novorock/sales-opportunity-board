@IsTest
public with sharing class UserDataServiceTest {
    @TestSetup
    private static void setup(){
        Opportunity opportunity = new Opportunity(
            Name='Opportunity',
            StageName='Prospecting',
            Amount=100,
            CloseDate=Date.today().addDays(5)
        );

        insert opportunity;

        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias='standt', Email='standarduser@testorg.com',
        EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        LocaleSidKey='en_US', ProfileId = p.Id,
        TimeZoneSidKey='America/Los_Angeles',
        UserName=uniqueUserName);

        insert u;
    }

    @IsTest
    private static void testGetAllUsers() {
        UserDataService.UsersData data = UserDataService.getAllUsers();
        System.assert(data.users.size() > 0);
    }

    @IsTest
    private static void testShareRecords() {
        User u = [SELECT Id FROM User WHERE Alias='standt'];
        Opportunity opportunity = [SELECT Id FROM Opportunity LIMIT 1][0];

        UserDataService.shareRecords(new List<String> {opportunity.Id}, u.Id);

        List<OpportunityShare> shr = [SELECT Id, UserOrGroupId FROM OpportunityShare WHERE UserOrGroupId=:u.Id];
        
        System.assertEquals(1, shr.size());   
    }
}