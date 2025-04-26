import { api, LightningElement } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';



export default class DragAndDropCard extends NavigationMixin (LightningElement) {
    @api record;
    @api stage;

    get isSameStage(){
        return this.stage === this.record.StageName;
    }

    navigationOppHandler(event){
        event.preventDefault();
        this.navigationHandler(event.target.dataset.id, 'Opportunity');
   }

   navigationAccHandler(event){
        event.preventDefault();
        this.navigationHandler(event.target.dataset.id, 'Account');
   }


    navigationHandler(Id, apiName){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes : {
                recordId : Id,
                objectApiName : apiName,
                actionName : 'view'
            }

        })
    }

    itemDragStart(){
        const event = new CustomEvent('itemdrag', {
            detail: this.record.Id
        })
        this.dispatchEvent(event)
    }

   
}