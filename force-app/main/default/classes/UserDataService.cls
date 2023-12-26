global with sharing class UserDataService {
    @AuraEnabled
    public static UsersData getAllUsers() {
        UsersData data = new UsersData();
        data.users = new List<UserData>();
        for (User u : [SELECT Id, Name FROM User]) {
            UserData user = new UserData();
            user.Id = u.Id;
            user.Name = u.Name;
            data.users.add(user);
        }

        return data;
    }

    @AuraEnabled
    public static void shareRecords(List<Id> recordsIds, Id userId) {
        List<OpportunityShare> shr = new List<OpportunityShare>();
        List<Opportunity> opportunities = new List<Opportunity>();

        for (Opportunity opportunity : [SELECT Id, StageName FROM Opportunity WHERE Id IN :recordsIds]) {
            opportunity.StageName = 'Shared';
            opportunities.add(opportunity);
        }

        for (Id recordId : recordsIds) {
            OpportunityShare opportunityShr = new OpportunityShare();
            opportunityShr.OpportunityId = recordId;
            opportunityShr.OpportunityAccessLevel = 'Edit';
            opportunityShr.UserOrGroupId = userId;
            shr.add(opportunityShr);
        }

        try {
            insert shr;
        } catch (Exception e) {
            String errorMsg = e.getMessage().substringAfter('_EXCEPTION,');
            throw new AuraHandledException(errorMsg);
        }

        try {
            update opportunities;
        } catch (Exception e) {
            String errorMsg = e.getMessage().substringAfter('_EXCEPTION,');
            throw new AuraHandledException(errorMsg);
        }
    }

    global class UserData {
        @AuraEnabled
        global Id Id;
        @AuraEnabled
        global String Name;
    }

    global class UsersData {
        @AuraEnabled
        global List<UserData> users;
    }
}