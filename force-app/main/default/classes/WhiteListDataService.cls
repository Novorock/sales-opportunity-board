global with sharing class WhiteListDataService {
    @AuraEnabled
    public static void addToWhiteList(List<String> recordsIds) {
        Set<String> ids = new Set<String>(recordsIds);

        if (ids == null || ids.size() < 1) {
            return;
        }

        List<WhiteListItem__c> items = new List<WhiteListItem__c>();

        for (Account account : [SELECT Id, Name FROM Account WHERE Id IN :ids]) {
            WhiteListItem__c item = new WhiteListItem__c();
            item.ParentId__c = account.Id;
            item.Name = account.Name;
            item.RecordType__c = 'Account';
            items.add(item);
        }

        for (Contact contact : [SELECT Id, Name FROM Contact WHERE Id IN :ids]) {
            WhiteListItem__c item = new WhiteListItem__c();
            item.ParentId__c = contact.Id;
            item.Name = contact.Name;
            item.RecordType__c = 'Contact';
            items.add(item);
        }

        try {
            insert items;
        } catch(Exception exc) {
            AuraException ex = new AuraException();
            ex.setMessage('Unabled to add records to white list. A problem is caused by: ' + exc.getMessage());
            throw ex;
        }
    }

    @AuraEnabled
    public static void removeFromWhiteList(List<String> recordsIds) {
        if (recordsIds == null || recordsIds.size() < 1) {
            return;
        }
        
        List<WhiteListItem__c> items = [
            SELECT Id FROM WhiteListItem__c
            WHERE ParentId__c IN :recordsIds
        ];

        delete items;
    }

    @AuraEnabled
    public static WhiteListItemsData getAllWhiteListItems() {
        WhiteListItemsData data = new WhiteListItemsData();
        data.items = new List<WhiteListItemData>();
        
        for (WhiteListItem__c item : [SELECT Name, ParentId__c, RecordType__c FROM WhiteListItem__c]) {
            WhiteListItemData dataItem = new WhiteListItemData();
            dataItem.Id = item.ParentId__c;
            dataItem.Name = item.Name;
            dataItem.RecordType = item.RecordType__c;
            data.items.add(dataItem);
        }

        return data;
    }

    @AuraEnabled
    public static WhiteListItemsData getRecordsNotInWhiteList() {
        WhiteListItemsData data = new WhiteListItemsData();
        data.items = new List<WhiteListItemData>();
        Set<String> ids = new Set<String>();

        for (WhiteListItem__c item : [SELECT ParentId__c FROM WhiteListItem__c]) {
            ids.add(item.ParentId__c);
        }

        for (Account account : [SELECT Id, Name FROM Account WHERE Id NOT IN :ids]) {
            WhiteListItemData dataItem = new WhiteListItemData();
            dataItem.Id = account.Id;
            dataItem.Name = account.Name;
            dataItem.RecordType = 'Account';
            data.items.add(dataItem);
        }

        for (Contact contact : [SELECT Id, Name FROM Contact WHERE Id NOT IN :ids]) {
            WhiteListItemData dataItem = new WhiteListItemData();
            dataItem.Id = contact.Id;
            dataItem.Name = contact.Name;
            dataItem.RecordType = 'Contact';
            data.items.add(dataItem);
        }

        return data;
    }

    global class WhiteListItemData {
        @AuraEnabled
        global String Id;
        @AuraEnabled
        global String Name;
        @AuraEnabled
        global String RecordType;
    }

    global class WhiteListItemsData {
        @AuraEnabled
        global List<WhiteListItemData> items;
    }
}