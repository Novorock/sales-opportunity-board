trigger OpportunityOnDeleteCascade on Opportunity (before delete, after delete) {
    if (Trigger.isBefore) {
        Set<Id> ids = new Set<Id>();
        for (Opportunity opportunity : Trigger.Old) {
            ids.add(opportunity.Id);
        }

        Set<String> contactsIds = new Set<String>();
        for (OpportunityContactRole junction : [
            SELECT Contact.Id FROM OpportunityContactRole
            WHERE Opportunity.Id IN :ids
        ]) {
            contactsIds.add(junction.Contact.Id);
        }

        
        List<WhiteListItem__c> items = [
            SELECT ParentId__c FROM WhiteListItem__c
            WHERE ParentId__c IN :contactsIds
        ];

        Set<String> whiteListIds = new Set<String>();
        for (WhiteListItem__c item : items) {
            whiteListIds.add(item.ParentId__c);
        } 
        contactsIds.removeAll(whiteListIds);
        
        List<Contact> contacts = [SELECT Id FROM Contact WHERE Id IN :contactsIds];

        delete contacts;
    } else if (Trigger.isAfter) {
        Set<String> accountsIds = new Set<String>();

        for (Opportunity opportunity : Trigger.Old) {
            accountsIds.add(opportunity.AccountId);
        }

        List<WhiteListItem__c> items = [
            SELECT ParentId__c FROM WhiteListItem__c
            WHERE ParentId__c IN :accountsIds
        ];

        Set<String> whiteListIds = new Set<String>();
        for (WhiteListItem__c item : items) {
            whiteListIds.add(item.ParentId__c);
        } 
        accountsIds.removeAll(whiteListIds);
    
        List<Account> accounts = [SELECT Id FROM Account WHERE Id IN :accountsIds];

        delete accounts;
    }
}