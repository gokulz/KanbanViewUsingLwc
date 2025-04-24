import { LightningElement, wire} from 'lwc';
import {getListUi} from 'lightning/uiListApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';


export default class OuterDragandDrop extends LightningElement {
    records;
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
}