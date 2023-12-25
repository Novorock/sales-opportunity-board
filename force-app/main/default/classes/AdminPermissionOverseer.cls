public without sharing class AdminPermissionOverseer {
    @AuraEnabled
    public static boolean hasAdminPermissions() {
        Boolean hasPermission = [
            SELECT PermissionsAuthorApex FROM Profile
            WHERE Id=:UserInfo.getProfileId()
        ].PermissionsAuthorApex;

        return hasPermission;
    }
}