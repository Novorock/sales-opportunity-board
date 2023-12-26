import { LightningElement, track } from 'lwc';
import shareRecords from '@salesforce/apex/UserDataService.shareRecords';
import getOpportunitiesPage from '@salesforce/apex/OpportunityDataService.getOpportunitiesPage';
import deleteOpportunities from '@salesforce/apex/OpportunityDataService.deleteOpportunities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class OpportunityTable extends LightningElement {
    loading = true;
    userListPopupOpened = false;
    shareButtonDisabled = true;
    deleteButtonDisabled = true;

    columns = [
        {
            label: "Name",
            fieldName: "Name"
        },
        {
            label: "Amount",
            fieldName: "Amount",
            type: "currency",
            typeAttributes: { currencyCode: "EUR" },
            cellAttributes: { alignment: 'center' }
        },
        { label: "Stage", fieldName: "Stage" }
    ];
    @track
    opportunities = [];
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
            this.currentPage = copy.PaginationData.CurrentPage;
            this.pagesTotalAmount = copy.PaginationData.PagesTotalAmount;
            this.loading = false;
            this.shareButtonDisabled = true;
            this.deleteButtonDisabled = true;
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

    showToastEvent(title, msg, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: msg,
            variant: variant
        }));
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
        this.shareButtonDisabled = this.deleteButtonDisabled = this.selectedIds.length < 1;
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

    shareRecords = (userId) => {
        shareRecords({ recordsIds: this.selectedIds, userId: userId }).then(() => {
            this.showToastEvent("Done!", "Sharing was successful.", "success");
            this.refreshData(this.currentPage);
        }).catch((error) => {
            this.showToastEvent("Woops! Something went wrong.", error.body.message, "error");
        });
    }

    deleteRecords() {
        if (this.selectedIds.length > 0) {
            deleteOpportunities({ recordsIds: this.selectedIds }).then(() => {
                this.showToastEvent("Done!", "Delete operation was successful.", "success");
                this.refreshData(this.currentPage);
            }).catch((error) => {
                this.showToastEvent("Woops! Something went wrong.", error.body.message, "error");
            });
        }
    }
}