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
            this.currentPage = p;
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

    connectedCallback() {
        this.refreshData(1);
    }

    callRowAction(e) {
        approveOpportunity({ recordId: e.detail.row.Id }).then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: "Success!",
                message: "The opportunity was approved",
                variant: "success"
            }));
            this.refreshData(this.currentPage);
        }).catch((error) => {
            console.log(error);
            this.dispatchEvent(new ShowToastEvent({
                title: "Woops! Something went wrong",
                message: "Unabled to approve opportunity",
                variant: "error"
            }));
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