import { LightningElement, api } from 'lwc';

export default class UserListPopup extends LightningElement {
    @api confirmCallback;
    @api cancelCallback;

    columns = [
        { label: "User Name", fieldName: "Name" }
    ];
    users = [...Array(25)].map((_, index) => {
        return {
            Id: index,
            Name: "User " + index
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