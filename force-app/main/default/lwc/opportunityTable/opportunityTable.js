import { LightningElement, track } from 'lwc';
import getOpportunitiesPage from '@salesforce/apex/OpportunityDataService.getOpportunitiesPage';

export default class OpportunityTable extends LightningElement {
    loading = true;

    @track
    opportunities = [...Array(10)].map((_, index) => {
        const stages = ["Prospecting", "Fully Paid", "Partially Paid"];
        
        return {
            Id: index,
            Name: "Opportunity" + index,
            Amount: Math.floor(Math.random() * 100),
            Stage: stages[Math.floor(Math.random() * stages.length)] 
        }
    });

    activeCheckboxes = new Set([]);
    hint = "";

    currentPage = 1;
    pagesTotalAmount = 10;
    previousDisabled = true;
    nextDisabled = false;

    refreshData(p) {
        this.loading = true;

        getOpportunitiesPage({ page: p }).then((data) => {
            let copy = JSON.parse(JSON.stringify(data));
            this.opportunities = copy.Data;
            this.currentPage = p;
            this.pagesTotalAmount = copy.PaginationData.PagesTotalAmount;
            this.loading = false;

            this.activeCheckboxes.clear();
            this.hint = "";

            if (this.currentPage === 1) {
                this.previousDisabled = true;
            } else {
                this.previousDisabled = false;
            }

            if (this.currentPage === this.pagesTotalAmount) {
                this.nextDisabled = true;
            } else {
                this.nextDisabled = false;
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    connectedCallback() {
        this.refreshData(1);
    }

    onCheckboxClick(e) {
        let value = e.target.value;

        if ("select-all-checkbox" === value) {
            let checkboxes = this.template.querySelectorAll(".table-checkbox");

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

                for (let i = 0; i < this.opportunities.length; i++) {
                    this.activeCheckboxes.add(this.opportunities[i].Id);
                }
            }
        } else if (this.activeCheckboxes.has(value)) {
            this.activeCheckboxes.delete(value);
            if (this.activeCheckboxes.size < 2 && this.activeCheckboxes.has("select-all-checkbox")) {
                let checkboxes = this.template.querySelectorAll(".table-checkbox");

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

    previousPage(e) {
        e.target?.blur();

        if (this.currentPage > 1) {
            this.refreshData(this.currentPage - 1);
        }
    }

    nextPage(e) {
        e.target?.blur();
        if (this.currentPage < this.pagesTotalAmount) {
            this.refreshData(this.currentPage + 1);
        }
    }
}