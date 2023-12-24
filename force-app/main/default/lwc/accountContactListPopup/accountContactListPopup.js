import { LightningElement, api } from 'lwc';

export default class AccountContactListPopup extends LightningElement {
    @api confirmCallback;
    @api cancelCallback;

    columns = [
        { label: "Name", fieldName: "Name" },
        { label: "Record Type", fieldName: "RecordType" }
    ];
    records = [...Array(15)].map((_, index) => {
        const recordsTypes = ['Account', 'Contact'];
        return {
            Id: index,
            Name: "Record " + index,
            RecordType: recordsTypes[Math.floor(Math.random() * recordsTypes.length)]
        }
    });
    selectedUsersIds = new Set([]);

    handleSelection(e) {
        let selectedRows = e.detail.selectedRows;
        this.selectedUsersIds.clear();
        selectedRows.forEach(el => {
            this.selectedUsersIds.add(el.Id);
        });
    }

    confirm(e) {
        e.target?.blur();
        this.confirmCallback(this.selectedUsersIds);
        this.cancelCallback();
    }

    cancel(e) {
        e.target?.blur();
        this.cancelCallback();
    }
}