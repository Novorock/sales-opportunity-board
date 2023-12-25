import { LightningElement, api, track } from 'lwc';
import getRecordsNotInWhiteList from '@salesforce/apex/WhiteListDataService.getRecordsNotInWhiteList';

export default class AccountContactListPopup extends LightningElement {
    @api confirmCallback;
    @api cancelCallback;
    loading = true;

    columns = [
        { label: "Name", fieldName: "Name" },
        { label: "Record Type", fieldName: "RecordType" }
    ];
    @track
    records = [...Array(15)].map((_, index) => {
        const recordsTypes = ['Account', 'Contact'];
        return {
            Id: index,
            Name: "Record " + index,
            RecordType: recordsTypes[Math.floor(Math.random() * recordsTypes.length)]
        }
    });
    selectedItems = [];

    connectedCallback() {
        getRecordsNotInWhiteList().then((data) => {
            let copy = JSON.parse(JSON.stringify(data));
            this.records = copy.items;
            this.loading = false;
        })
    }

    handleSelection(e) {
        // eslint-disable-next-line no-unused-vars
        this.selectedItems = e.detail.selectedRows.map((element, _) => {
            return element.Id;
        });
    }

    confirm(e) {
        e.target?.blur();
        this.confirmCallback(this.selectedItems);
        this.cancelCallback();
    }

    cancel(e) {
        e.target?.blur();
        this.cancelCallback();
    }
}