global with sharing class UserDataService {
    @AuraEnabled
    public static boolean hasAdminPermissions() {
        Boolean hasPermission = [
            SELECT PermissionsAuthorApex FROM Profile
            WHERE Id=:UserInfo.getProfileId()
        ].PermissionsAuthorApex;

        return hasPermission;
    }

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
        for (Id recordId : recordsIds) {
            OpportunityShare opportunityShr = new OpportunityShare();
            opportunityShr.OpportunityId = recordId;
            opportunityShr.OpportunityAccessLevel = 'Edit';
            opportunityShr.UserOrGroupId = userId;
            shr.add(opportunityShr);
        }

        Database.SaveResult[] sr = Database.insert(shr, false);

        for (Database.SaveResult result : sr) {
            if (!result.isSuccess()) {
                Database.Error err = result.getErrors()[0];
                AuraException ex = new AuraException();
                ex.setMessage('Unable to share records. Exception caused by: ' + err.getMessage());
                throw ex;
            }
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