trigger OpportunityOnDeleteCascade on Opportunity (before delete, after delete) {
    if (Trigger.isBefore) {
        Set<Id> ids = new Set<Id>();
        for (Opportunity opportunity : Trigger.Old) {
            ids.add(opportunity.Id);
        }
    
        Map<String, String> junctionMap = new Map<String,String>(); 
    
        for (OpportunityContactRole junction : [
            SELECT Opportunity.Id, Opportunity.Account.Id, Contact.Id FROM OpportunityContactRole
            WHERE Opportunity.Id IN :ids
        ]) {
            junctionMap.put(junction.Contact.Id, junction.Opportunity.Id);
            junctionMap.put(junction.Opportunity.Account.Id, junction.Opportunity.Id);
        }
    
        Set<String> prevented = new Set<String>();
    
        for (WhiteListItem__c item : [
            SELECT ParentId__c FROM WhiteListItem__c
            WHERE ParentId__c IN :junctionMap.keySet()
        ]) {
            prevented.add(junctionMap.get(item.ParentId__c));
            junctionMap.remove(item.ParentId__c);
        }
    
        for (Opportunity opportunity : Trigger.Old) {
            if (prevented.contains(opportunity.Id)) {
                Opportunity t = [SELECT Name FROM Opportunity WHERE Id = :opportunity.Id LIMIT 1][0];
                opportunity.addError('Unabled to delete opportunity with name "' + t.Name + '", because it is related to item from white list.');
            }
        }

        delete [SELECT Id FROM Contact WHERE Id IN :junctionMap.keySet()];
    } else if (Trigger.isAfter) {
        Set<Id> ids = new Set<Id>();
        Set<Id> accountsIds = new Set<Id>();

        for (Opportunity opportunity : Trigger.Old) {
            accountsIds.add(opportunity.AccountId);
        }

        delete [SELECT Id FROM Account WHERE Id IN :accountsIds];
    }
}