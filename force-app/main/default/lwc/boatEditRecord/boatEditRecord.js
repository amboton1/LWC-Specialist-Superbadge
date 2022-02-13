import { api, LightningElement, track, wire } from 'lwc';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, MessageContext, unsubscribe } from 'lightning/messageService';
import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';

export default class BoatEditRecord extends LightningElement {
    subscription = null;
    boatId;
    objectApiName = 'Boat__c';
    notSelectedLabel = 'Not single boat was selected';
    boatEditLabel = 'Boat Edit Record';
    @track fields = [PRICE_FIELD, DESCRIPTION_FIELD];

    @api
    get recordId() {
        return this.boatId;
    }

    get showEditForm() {
        return this.recordId;
    }

    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
    }

    @wire(MessageContext)
    messageContext;

    subscribeMC() {
        if (this.subscription || this.recordId) {
            return null;
        }

        this.subscription = subscribe(this.messageContext, BOATMC, (message) => {
            this.boatId = message.recordId;
        }, { scope: APPLICATION_SCOPE });
    }

    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    connectedCallback() {
        this.subscribeMC();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }
}