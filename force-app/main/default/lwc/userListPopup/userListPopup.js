import { LightningElement, api, track } from 'lwc';
import getAllUsers from '@salesforce/apex/UserDataService.getAllUsers';

export default class UserListPopup extends LightningElement {
    @api confirmCallback;
    @api cancelCallback;
    loading = true;

    columns = [
        { label: "User Name", fieldName: "Name" }
    ];
    @track
    users = [];
    selectedUserId;

    connectedCallback() {
        getAllUsers().then((data) => {
            let copy = JSON.parse(JSON.stringify(data));
            this.users = copy.users;
            this.loading = false;
        }).catch((error) => {
            console.log(error);
        })
    }

    handleSelection(e) {
        let selectedRows = e.detail.selectedRows;
        this.selectedUserId = selectedRows[0].Id;
    }

    confirm(e) {
        e.target?.blur();
        this.confirmCallback(this.selectedUserId);
        this.cancelCallback();
    }

    cancel(e) {
        e.target?.blur();
        this.cancelCallback();
    }
}