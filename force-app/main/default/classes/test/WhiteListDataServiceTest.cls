@isTest
private class WhiteListDataServiceTest {
    @TestSetup
    private static void setup(){
        Account account = new Account(
        	Name='Account'
        );

        insert account;

        Contact contact = new Contact(
        	FirstName='Test',
            LastName='Contact',
            Email='test.contact@gmail.com'
        );
        
        insert contact;
    }

    @isTest
    private static void testAddToWhiteList() {
        Account account = [SELECT Id FROM Account LIMIT 1][0];
        Contact contact = [SELECT Id FROM Contact LIMIT 1][0];
        
        WhiteListDataService.addToWhiteList(new List<String>());
        List<WhiteListItem__c> items = [SELECT Id FROM WhiteListItem__c];
        System.assertEquals(0, items.size());

        WhiteListDataService.addToWhiteList(new List<String> {account.Id, contact.Id});
        items = [SELECT Id FROM WhiteListItem__c];
        System.assertEquals(2, items.size());
    }

    @isTest
    private static void testRemoveFromWhiteList() {
        Account account = [SELECT Id FROM Account LIMIT 1][0];
        Contact contact = [SELECT Id FROM Contact LIMIT 1][0];
        
        WhiteListDataService.addToWhiteList(new List<String>());
        List<WhiteListItem__c> items = [SELECT Id FROM WhiteListItem__c];
        System.assertEquals(0, items.size());
        WhiteListDataService.removeFromWhiteList(new List<String> {account.Id});
        System.assertEquals(0, items.size());

        WhiteListDataService.addToWhiteList(new List<String> {account.Id, contact.Id});
        items = [SELECT Id FROM WhiteListItem__c];
        System.assertEquals(2, items.size());
        WhiteListDataService.removeFromWhiteList(new List<String> {account.Id});
        items = [SELECT Id FROM WhiteListItem__c];
        System.assertEquals(1, items.size());
    }

    @isTest
    private static void testGetAllWhiteListItems() {
        Account account = [SELECT Id FROM Account LIMIT 1][0];
        Contact contact = [SELECT Id FROM Contact LIMIT 1][0];
        WhiteListDataService.addToWhiteList(new List<String> {account.Id, contact.Id});
        WhiteListDataService.WhiteListItemsData data = WhiteListDataService.getAllWhiteListItems();
        System.assertEquals(2, data.items.size());
    }

    @isTest
    private static void testGetRecordsNotInWhiteList() {
        Account account = [SELECT Id FROM Account LIMIT 1][0];
        WhiteListDataService.addToWhiteList(new List<String> {account.Id});
        WhiteListDataService.WhiteListItemsData data = WhiteListDataService.getRecordsNotInWhiteList();
        System.assertEquals(1, data.items.size());
    }
}