import { LightningElement, track } from 'lwc';
import getAllWhiteListRecords from "@salesforce/apex/WhiteListDataService.getAllWhiteListItems"

export default class WhiteList extends LightningElement {
    loading = true;
    accountContactListPopupOpened = false;

    columns = [
        { label: "Name", fieldName: "Name" },
        { label: "Record Type", fieldName: "RecordType" }
    ];
    @track
    records = [...Array(10)].map((_, index) => {
        const recordsTypes = ['Account', 'Contact'];
        return {
            Id: index,
            Name: "Record " + index,
            RecordType: recordsTypes[Math.floor(Math.random() * recordsTypes.length)]
        }
    });
    selectedIds = new Set();

    connectedCallback() {
        getAllWhiteListRecords().then((data) => {
            let copy = JSON.parse(JSON.stringify(data));
            this.records = copy.items;
            this.loading = false;
        });
    }
    
    handleSelection(e) {
        let selectedRows = e.detail.selectedRows;
        this.selectedIds.clear();
        selectedRows.forEach(el => {
            this.selectedIds.add(el.Id);
        });
        
        this.hint = this.selectedIds.size > 0 ? `${this.selectedIds.size} items selected` : ""; 
    }

    openAccountContactListPopup(e) {
        e.target?.blur();
        this.accountContactListPopupOpened = true;
    }

    closeAccountContactListPopup = () => {
        this.accountContactListPopupOpened = false;
    }

    addRecordsToWhiteList = (records) => {
        console.log(records);
    }

    deleteRecordsFromWhiteList() {
        console.log(this.selectedIds);
    }
}