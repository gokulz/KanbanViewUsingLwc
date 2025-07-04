import { LightningElement, wire} from 'lwc';
import {getListUi} from 'lightning/uiListApi';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import { updateRecord } from 'lightning/uiRecordApi';
import {refreshApex} from '@salesforce/apex';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import ID_FIELD from '@salesforce/schema/Opportunity.Id';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


export default class OuterDragandDrop extends LightningElement {
    records;
    pickValues;
    recordId; 

    //fetching the opportunity
     @wire(getListUi,{
        objectApiName : OPPORTUNITY_OBJECT,
        listViewApiName : 'AllOpportunities'
     }) wiredListView({data, error}){
        if(data){
            console.log('Get List Ui', data);
            this.records = data.records.records.map(item => {
                const field = item.fields;
                const account = field.Account?.value?.fields;
                //field.Account.value.fields; //works if all the property exists 
                //if value is missing it will throw the error
                return {
                    'Id': field.Id?.value,
                   'Name': field.Name?.value,
                   'AccountId': account?.Id?.value,
                    'AccountName': account?.Name?.value,
                    'CloseDate': field.CloseDate?.value,
                    'StageName': field.StageName?.value,
                    'Amount': field.Amount?.value
                };
                
            });
            console.log('getListUi', JSON.stringify(this.records));
        }
        if(error){
            console.log(error);
        }
     }
     //to get metadata about specific object
     @wire(getObjectInfo,{
         objectApiName: OPPORTUNITY_OBJECT,
     }) objectInfo

     //fetching the stage picklistvalue

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: STAGE_FIELD
    }) 
    stagePicklistValues({data, error}){
      if(data){
        console.log('Stage Picklist : ' , data);
        this.pickValues = data.values.map(item => item.value)
      } if(error){
        console.log(error);
      }
    }

    //getter to calculate the width 
    get calcWidth(){
        let len = this.pickValues.length +1;
        return `width: calc(100vw / ${len})`;
    }
    handleListItemDrag(event){
        this.recordId = event.detail
    }
    handleItemDrop(event){
        let stage = event.detail
        this.updateHandler(stage)
    }

    updateHandler(stage){
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[STAGE_FIELD.fieldApiName] = stage;
        const recordInput ={fields}
        updateRecord(recordInput)
        .then(()=>{
            console.log("Updated Successfully")
            this.showToast()
            return refreshApex(this.wiredListView)
        }).catch(error=>{
            console.error(error)
        })
    }
   
 
    showToast(){
        this.dispatchEvent(
            new ShowToastEvent({
                title:'Success',
                message:'Stage updated Successfully',
                variant:'success'
            })
        )
    }

}