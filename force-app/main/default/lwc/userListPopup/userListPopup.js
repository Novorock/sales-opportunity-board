import { LightningElement, api } from 'lwc';

export default class UserListPopup extends LightningElement {
    @api confirmCallback;
    @api cancelCallback;

    users = [
        {
            Id: "1",
            Name: "User 1"
        },
        {
            Id: "2",
            Name: "User 2"
        },
        {
            Id: "3",
            Name: "User 3"
        }, {
            Id: "4",
            Name: "User 4"
        },
        {
            Id: "5",
            Name: "User 5"
        },
        {
            Id: "6",
            Name: "User 6"
        },
        {
            Id: "7",
            Name: "User 7"
        },
    ];
    activeCheckboxes = new Set([]);

    onCheckboxClick(e) {
        let value = e.target.value;

        if ("select-all-checkbox" === value) {
            let checkboxes = this.template.querySelectorAll(".popup-checkbox");

            if (this.activeCheckboxes.has(value)) {
                this.activeCheckboxes.clear();

                for (let i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            } else {
                this.activeCheckboxes.add(value);

                for (let i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }

                for (let i = 0; i < this.users.length; i++) {
                    this.activeCheckboxes.add(this.users[i].Id);
                }
            }
        } else if (this.activeCheckboxes.has(value)) {
            this.activeCheckboxes.delete(value);
            if (this.activeCheckboxes.size < 2 && this.activeCheckboxes.has("select-all-checkbox")) {
                let checkboxes = this.template.querySelectorAll(".popup-checkbox");

                this.activeCheckboxes.clear();

                for (let i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        } else {
            this.activeCheckboxes.add(value);
        }

        let n = this.activeCheckboxes.has('select-all-checkbox') ? this.activeCheckboxes.size - 1 : this.activeCheckboxes.size;
        if (n === 0) {
            this.hint = "";
        } else {
            this.hint = this.hint = `${n} items selected from 10`;
        }
    }
}