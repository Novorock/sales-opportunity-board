trigger OpportunityOnDeleteCascade on Opportunity (before delete) {
    List<OpportunityContactRole> junctions = new List<OpportunityContactRole>();
    List<Account> accounts = new List<Account>();

    for (Opportunity opportunity : Trigger.New) {
        junctions.addAll([
            SELECT Contact.Id FROM OpportunityContactRole
            WHERE Opportunity.Id = : opportunity.Id
        ]);
        accounts.add(opportunity.Account);
    }

    List<Contact> contacts = new List<Contact>();
    for (OpportunityContactRole junction : junctions) {
        contacts.add(junction.Contact);
    }
}