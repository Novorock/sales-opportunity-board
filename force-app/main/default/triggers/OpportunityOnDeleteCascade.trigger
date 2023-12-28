trigger OpportunityOnDeleteCascade on Opportunity (before delete, after delete) {
    if (Trigger.isBefore) {    
        Map<String, String> junctionMap = new Map<String,String>();
        Set<String> ids = new Set<String>();
        for (Opportunity opportunity : Trigger.Old) {
            ids.add(opportunity.Id);
        } 

        for (OpportunityContactRole junction : [
            SELECT Opportunity.Id, Contact.Id FROM OpportunityContactRole
            WHERE Opportunity.Id IN :ids
        ]) {
            junctionMap.put(junction.Contact.Id, junction.Opportunity.Id);
        }
    
        for (WhiteListItem__c item : [
            SELECT ParentId__c FROM WhiteListItem__c
            WHERE ParentId__c IN :junctionMap.keySet()
        ]) {
            junctionMap.remove(item.ParentId__c);
        }
    
        delete [SELECT Id FROM Contact WHERE Id IN :junctionMap.keySet()];
    } else if (Trigger.isAfter) {
        Set<Id> accountsIds = new Set<Id>();

        for (Opportunity opportunity : Trigger.Old) {
            accountsIds.add(opportunity.AccountId);
        }

        for (WhiteListItem__c item : [
            SELECT ParentId__c FROM WhiteListItem__c
            WHERE ParentId__c IN :accountsIds
        ]) {
            accountsIds.remove(item.ParentId__c);
        }

        List<Contact> contacts = [SELECT Id, Account.Id FROM Contact WHERE Account.Id IN :accountsIds];

        for (Contact contact : contacts) {
            contact.AccountId = null;
        }

        update contacts;

        delete [SELECT Id FROM Account WHERE Id IN :accountsIds];
    }
}