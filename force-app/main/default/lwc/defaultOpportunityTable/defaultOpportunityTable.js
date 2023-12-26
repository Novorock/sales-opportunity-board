import { LightningElement, track } from 'lwc';
import getOpportunitiesPage from '@salesforce/apex/OpportunityDataService.getOpportunitiesPage';
import approveOpportunity from '@salesforce/apex/OpportunityDataService.approveOpportunity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class DefaultOpportunityTable extends LightningElement {
    loading = true;

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
        { label: "Stage", fieldName: "Stage" },
        {
            label: "Action",
            type: "button-icon",
            typeAttributes: {
                iconName: "utility:approval",
                variant: "brand"
            }
        }
    ];
    @track
    opportunities = [];
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

    callRowAction(e) {
        approveOpportunity({ recordId: e.detail.row.Id }).then(() => {
            this.showToastEvent("Success!", "Approving was successful.", "success");
            this.refreshData(this.currentPage);
        }).catch((error) => {
            this.showToastEvent("Woops! Something went wrong.", error.body.message, "error");
        });
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