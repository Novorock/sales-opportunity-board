import { LightningElement, track } from 'lwc';
import getAllWhiteListRecords from "@salesforce/apex/WhiteListDataService.getAllWhiteListItems"
import addToWhiteList from '@salesforce/apex/WhiteListDataService.addToWhiteList';
import removeFromWhiteList from '@salesforce/apex/WhiteListDataService.removeFromWhiteList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WhiteList extends LightningElement {
    loading = true;
    accountContactListPopupOpened = false;
    deleteButtonDisabled = true;

    columns = [
        { label: "Name", fieldName: "Name" },
        { label: "Record Type", fieldName: "RecordType" }
    ];
    @track
    records = [];
    selectedIds = [];

    refreshData() {
        getAllWhiteListRecords().then((data) => {
            let copy = JSON.parse(JSON.stringify(data));
            this.records = copy.items;
            this.loading = false;
            this.deleteButtonDisabled = true;
        });
    }

    showToastEvent(title, msg, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: msg,
            variant: variant
        }));
    }

    connectedCallback() {
        this.refreshData();
    }

    handleSelection(e) {
        let selectedRows = e.detail.selectedRows;
        this.selectedIds = [];
        selectedRows.forEach(el => {
            this.selectedIds.push(el.Id);
        });

        this.deleteButtonDisabled = this.selectedIds.length < 1;
    }

    openAccountContactListPopup(e) {
        e.target?.blur();
        this.accountContactListPopupOpened = true;
    }

    closeAccountContactListPopup = () => {
        this.accountContactListPopupOpened = false;
    }

    addRecordsToWhiteList = (records) => {
        if (records.length > 0) {
            addToWhiteList({ recordsIds: records }).then(() => {
                this.showToastEvent("Success!", "Adding records to white list was successful.", "success");
                this.loading = true;
                this.refreshData();
            }).catch((error) => {
                this.showToastEvent("Woops! Something went wrong.", error.body.message, "error");
            });
        }
    }

    deleteRecordsFromWhiteList() {
        if (this.selectedIds.length > 0) {
            removeFromWhiteList({ recordsIds: this.selectedIds }).then(() => {
                this.showToastEvent("Success!", "Removing records from white list was successful.", "success");
                this.loading = true;
                this.refreshData();
            }).catch((error) => {
                this.showToastEvent("Woops! Something went wrong.", error.body.message, "error");
            });
        }
    }
}