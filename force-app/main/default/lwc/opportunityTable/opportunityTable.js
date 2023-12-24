import { LightningElement, track } from 'lwc';
import getOpportunitiesPage from '@salesforce/apex/OpportunityDataService.getOpportunitiesPage';

export default class OpportunityTable extends LightningElement {
    loading = true;

    columns = [
        { label: "Name", fieldName: "Name" },
        { label: "Amount", fieldName: "Amount" },
        { label: "Stage", fieldName: "Stage" }
    ];
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
    selectedIds = new Set();
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
            this.selectedIds.clear();
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

    handleSelection(e) {
        let selectedRows = e.detail.selectedRows;
        this.selectedIds.clear();
        selectedRows.forEach(el => {
            this.selectedIds.add(el.Id);
        });
        
        this.hint = this.selectedIds.size > 0 ? `${this.selectedIds.size} items selected` : ""; 
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