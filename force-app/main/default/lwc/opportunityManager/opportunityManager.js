import { LightningElement } from 'lwc';
import hasAdminPermissions from '@salesforce/apex/AdminPermissionOverseer.hasAdminPermissions';
import adminTemplate from './opportunityManager.html'
import defaultTemplate from './defaultTemplate.html'

export default class OpportunityManager extends LightningElement {
    isDefaultUser = true;

    connectedCallback() {
        hasAdminPermissions().then((result) => {
            this.isDefaultUser = !result;
        });
    }

    render() {
        return this.isDefaultUser ? defaultTemplate : adminTemplate;
    }
}