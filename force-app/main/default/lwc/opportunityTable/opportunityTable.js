import { LightningElement, track } from 'lwc';
import getOpportunitiesPage from '@salesforce/apex/OpportunityDataService.getOpportunitiesPage';
import deleteOpportunities from '@salesforce/apex/OpportunityDataService.deleteOpportunities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class OpportunityTable extends LightningElement {
    loading = true;
    userListPopupOpened = false;

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
    selectedIds = [];
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
            this.selectedIds = [];
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
        this.selectedIds = [];
        selectedRows.forEach(el => {
            this.selectedIds.push(el.Id);
        });

        this.hint = this.selectedIds.length > 0 ? `${this.selectedIds.length} items selected` : "";
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

    openUserListPopup(e) {
        e.target?.blur();
        this.userListPopupOpened = true;
    }

    closeUserListPopup = () => {
        this.userListPopupOpened = false;
    }

    shareRecords = (users) => {
        console.log(users);
    }

    deleteRecords() {
        if (this.selectedIds.length > 0) {
            deleteOpportunities({ recordsIds: this.selectedIds }).then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Success!",
                    message: "Records are deleted",
                    variant: "success"
                }));
                this.refreshData(this.currentPage);
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