import { LightningElement, track } from 'lwc';
import getAllWhiteListRecords from "@salesforce/apex/WhiteListDataService.getAllWhiteListItems"
import addToWhiteList from '@salesforce/apex/WhiteListDataService.addToWhiteList';
import removeFromWhiteList from '@salesforce/apex/WhiteListDataService.removeFromWhiteList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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
    selectedIds = [];

    refreshData() {
        getAllWhiteListRecords().then((data) => {
            let copy = JSON.parse(JSON.stringify(data));
            this.records = copy.items;
            this.loading = false;
        });
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
        if (records.length > 0) {
            addToWhiteList({ recordsIds: records }).then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Success!",
                    message: "Records are added to white list",
                    variant: "success"
                }));
                this.loading = true;
                this.refreshData();
            }).catch((error) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Woops! Something went wrong",
                    message: error.message,
                    variant: "error"
                }));
            });
        }
    }

    deleteRecordsFromWhiteList() {
        if (this.selectedIds.length > 0) {
            removeFromWhiteList({ recordsIds: this.selectedIds }).then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Success!",
                    message: "Records are removed from white list",
                    variant: "success"
                }));
                this.loading = true;
                this.refreshData();
            }).catch((error) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Woops! Something went wrong",
                    message: error.message,
                    variant: "error"
                }));
            });
        }
    }
}