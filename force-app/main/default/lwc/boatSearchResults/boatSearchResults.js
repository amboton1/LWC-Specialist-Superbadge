import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { publish, MessageContext } from 'lightning/messageService';
import { api, LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  boatTypeId = '';
  boats;
  isLoading = false;
  @track draftValues = [];
  columns = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Length', fieldName: 'Length__c', type: 'number' },
    { label: 'Price', fieldName: 'Price__c', type: 'currency' },
    { label: 'Description', fieldName: 'Description__c' },
  ];
  
  // wired message context
  @wire(MessageContext)
  messageContext;

  // wired getBoats method 
  @wire(getBoats, {boatTypeId: '$boatTypeId'})
  wiredBoats({error, data}) {
    if (data) {
        this.boats = data;
    } else if (error) {
      const evt = new ShowToastEvent({
          title: ERROR_TITLE,
          variant: ERROR_VARIANT,
      });
      this.dispatchEvent(evt);
    }
  }
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api searchBoats(boatTypeId) {
      this.isLoading = true;
      this.boatTypeId = boatTypeId;
      this.notifyLoading(this.isLoading);
  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api async refresh() {
    this.notifyLoading(true);
    refreshApex(this.boats);
    this.notifyLoading(false);
  }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
    const payload = { recordId: boatId };
  
    publish(this.messageContext, BOATMC, payload);
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    let updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then(() => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: SUCCESS_TITLE,
                message: MESSAGE_SHIP_IT,
                variant: SUCCESS_VARIANT
            })
        );
        // Display fresh data in the form
        this.draftValues = [];
        return this.refresh();
    })
    .catch(error => {
      this.dispatchEvent(
        new ShowToastEvent({
            title: ERROR_TITLE,
            message: error.body.message,
            variant: ERROR_VARIANT
        })
      );
    })
    .finally(() => {
      updatedFields = [];
    });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
      if (!isLoading) {
          this.dispatchEvent(new CustomEvent('loading'));
      }
      this.dispatchEvent(CustomEvent('doneloading'));
  }
}