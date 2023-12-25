global with sharing class WhiteListDataService {
    @AuraEnabled
    public static Boolean addToWhiteList(WhiteListItemsData data) {
        if (data.items == null || data.items.size() < 1) {
            return true;
        }

        Schema.DescribeFieldResult fieldDescription = WhiteListItem__c.RecordType__c.getDescribe();
        Set<String> entries = new Set<String>();
        Set<String> ids = new Set<String>();

        for (Schema.PicklistEntry entry : fieldDescription.getPicklistValues()) {
            entries.add(entry.getValue());
        }
        
        for (WhiteListItem__c item : [SELECT ParentId__c FROM WhiteListItem__c]) {
            ids.add(item.ParentId__c);
        }

        List<WhiteListItem__c> newItems = new List<WhiteListItem__c>();

        for (WhiteListItemData item : data.items) {
            if (ids.contains(item.Id))
                continue;
            
            WhiteListItem__c newItem = new WhiteListItem__c();
            newItem.ParentId__c = item.Id;
            newItem.Name = item.Name;
            newItem.RecordType__c = item.RecordType;
            newItems.add(newItem);
        }

        insert newItems;

        return true;
    }

    @AuraEnabled
    public static Boolean removeFromWhiteList(WhiteListItemsData data) {
        if (data.items == null || data.items.size() < 1) {
            return true;
        }

        Set<String> ids = new Set<String>();

        for (WhiteListItemData item : data.items) {            
            ids.add(item.Id);
        }
        
        List<WhiteListItem__c> items = [
            SELECT Id FROM WhiteListItem__c
            WHERE ParentId__c IN :ids
        ];

        delete items;

        return true;
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