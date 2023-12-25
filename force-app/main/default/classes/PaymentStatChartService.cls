global with sharing class PaymentStatChartService {
    @AuraEnabled
    public static PaymentStatData getPaymentStat() {
        AggregateResult result = [
            SELECT SUM(PaidAmount__c) paid, SUM(Amount) full
            FROM Opportunity
        ][0];

        PaymentStatData stat = new PaymentStatData();
        stat.PaidAmount = (Decimal) result.get('paid');
        stat.RemainAmount = (Decimal) result.get('full') - stat.PaidAmount;

        return stat;
    }

    global class PaymentStatData {
        @AuraEnabled
        global Decimal PaidAmount;
        @AuraEnabled
        global Decimal RemainAmount; 
    }
}