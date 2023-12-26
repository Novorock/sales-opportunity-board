@IsTest
public with sharing class AdminPermissionOverseerTest {
    @IsTest
    private static void testHasAdminPermissions() {
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        LocaleSidKey='en_US', ProfileId = p.Id,
        TimeZoneSidKey='America/Los_Angeles',
        UserName=uniqueUserName);

        System.runAs(u) {
            System.assertEquals(false, AdminPermissionOverseer.hasAdminPermissions());
        }

        uniqueUserName = 'sccraftadmintest' + DateTime.now().getTime() + '@testorg.com';
        p = [SELECT Id FROM Profile WHERE Name='System Administrator'];
        u = new User(Alias = 'scadmn', Email='admin@testorg.com',
        EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        LocaleSidKey='en_US', ProfileId = p.Id,
        TimeZoneSidKey='America/Los_Angeles',
        UserName=uniqueUserName);

        System.runAs(u) {
            System.assertEquals(true, AdminPermissionOverseer.hasAdminPermissions());
        }
    }
}